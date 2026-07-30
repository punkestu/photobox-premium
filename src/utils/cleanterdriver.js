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

async function resizeImageToPaper(url, paperWidth = 576) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    const ratio = img.height / img.width;

    const canvas = document.createElement("canvas");
    canvas.width = paperWidth;
    canvas.height = Math.round(paperWidth * ratio);

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/png").replace(/^data:image\/\w+;base64,/, "");
}

export async function printImage(base64Image) {
    const resized = await resizeImageToPaper(base64Image);
    const res = await fetch(`${BRIDGE_URL}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "cut": true,
            "content": [{
                "type": "image", "base64": resized, "align": "center", "dither": false
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