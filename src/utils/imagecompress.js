import imageCompression from "browser-image-compression";

export async function compressDataUrl(
    dataUrl,
    maxSizeMB = 3,
    maxWidthOrHeight = 1920
) {
    const file = urlToFile(dataUrl, "buffer");

    // Compress
    const compressedFile = await imageCompression(file, {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
        initialQuality: 1,
    });

    // Convert back to Data URL
    return imageCompression.getDataUrlFromFile(compressedFile);
}

function urlToFile(dataUrl, fileName) {
    const [header, base64] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)?.[1] || "";

    const binary = atob(base64);
    const len = binary.length;

    const buffer = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        buffer[i] = binary.charCodeAt(i);
    }

    return new File([new Blob([buffer], { type: mime })], fileName, {
        type: mime,
    });
}