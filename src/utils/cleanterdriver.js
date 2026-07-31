const BRIDGE_URL = "http://localhost:9100";
var isPrinting = false;

export async function isBridgeAvailable() {
    try {
        const res = await fetch(`${BRIDGE_URL}/health`, {
            signal: AbortSignal.timeout(1500),
        });
        return res.ok;
    } catch {
        return false;
    }
}

export async function printImage(base64Image) {
    base64Image = rotateBase64(base64Image, 180);
    const res = await fetch(`${BRIDGE_URL}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "cut": true,
            "content": [{
                "type": "image", "base64": base64Image.split(",")[1], "align": "center"
            }]
        }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Print failed: ${res.status} ${err.detail ?? ""}`);
    }
    return res.json();
}

export async function PrintImage(base64Image) {
    base64Image = rotateBase64(base64Image, 180);
    if (isPrinting) throw new Error(`Printer still working...`);
    isPrinting = true;
    const ready = await isBridgeAvailable();
    if (!ready) {
        throw new Error(`Printer was not ready yet...`);
    }
    try {
        const result = await printImage(base64Image);
        return result;
    } catch (e) {
        return e;
    } finally {
        isPrinting = false;
    }
}

export async function printReceipt(content) {
    const res = await fetch(`${BRIDGE_URL}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cut: true, content }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Print failed: ${res.status} ${err.detail ?? ""}`);
    }
}

export function rotateBase64(base64, degrees = 90) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const radians = (degrees * Math.PI) / 180;

            if (degrees % 180 === 0) {
                canvas.width = img.width;
                canvas.height = img.height;
            } else {
                canvas.width = img.height;
                canvas.height = img.width;
            }

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(radians);

            ctx.drawImage(
                img,
                -img.width / 2,
                -img.height / 2,
                img.width,
                img.height
            );

            resolve(canvas.toDataURL("image/jpeg", 0.9));
        };

        img.onerror = reject;
        img.src = base64;
    });
}

export async function thermalOptimize(base64, printerWidth = 576) {
    // Load image
    const img = new Image();
    img.src = base64;

    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    // Resize
    const scale = printerWidth / img.width;
    const width = printerWidth;
    const height = Math.round(img.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
    });

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, 0, 0, width, height);

    let image = ctx.getImageData(0, 0, width, height);
    let d = image.data;

    // -------------------------
    // Auto Contrast
    // -------------------------

    let min = 255;
    let max = 0;

    for (let i = 0; i < d.length; i += 4) {
        const gray =
            d[i] * 0.299 +
            d[i + 1] * 0.587 +
            d[i + 2] * 0.114;

        min = Math.min(min, gray);
        max = Math.max(max, gray);
    }

    const range = Math.max(1, max - min);

    for (let i = 0; i < d.length; i += 4) {
        let r = ((d[i] - min) * 255) / range;
        let g = ((d[i + 1] - min) * 255) / range;
        let b = ((d[i + 2] - min) * 255) / range;

        d[i] = Math.min(255, Math.max(0, r));
        d[i + 1] = Math.min(255, Math.max(0, g));
        d[i + 2] = Math.min(255, Math.max(0, b));
    }

    // -------------------------
    // Sharpen
    // -------------------------

    const copy = new Uint8ClampedArray(d);

    const kernel = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0,
    ];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {

            let r = 0;
            let g = 0;
            let b = 0;

            let k = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {

                    const idx =
                        ((y + ky) * width + (x + kx)) * 4;

                    r += copy[idx] * kernel[k];
                    g += copy[idx + 1] * kernel[k];
                    b += copy[idx + 2] * kernel[k];

                    k++;
                }
            }

            const idx = (y * width + x) * 4;

            d[idx] = Math.min(255, Math.max(0, r));
            d[idx + 1] = Math.min(255, Math.max(0, g));
            d[idx + 2] = Math.min(255, Math.max(0, b));
        }
    }

    // -------------------------
    // Grayscale
    // -------------------------

    const gray = new Float32Array(width * height);

    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        gray[p] =
            d[i] * 0.299 +
            d[i + 1] * 0.587 +
            d[i + 2] * 0.114;
    }

    // -------------------------
    // Floyd-Steinberg Dither
    // -------------------------

    for (let y = 0; y < height; y++) {

        for (let x = 0; x < width; x++) {

            const idx = y * width + x;

            const oldPixel = gray[idx];
            const newPixel = oldPixel < 128 ? 0 : 255;

            const err = oldPixel - newPixel;

            gray[idx] = newPixel;

            if (x + 1 < width)
                gray[idx + 1] += err * 7 / 16;

            if (x > 0 && y + 1 < height)
                gray[idx + width - 1] += err * 3 / 16;

            if (y + 1 < height)
                gray[idx + width] += err * 5 / 16;

            if (x + 1 < width && y + 1 < height)
                gray[idx + width + 1] += err * 1 / 16;
        }
    }

    // -------------------------
    // Write back
    // -------------------------

    for (let i = 0, p = 0; i < d.length; i += 4, p++) {

        const c = gray[p];

        d[i] = c;
        d[i + 1] = c;
        d[i + 2] = c;
        d[i + 3] = 255;
    }

    ctx.putImageData(image, 0, 0);

    return canvas.toDataURL("image/png");
}