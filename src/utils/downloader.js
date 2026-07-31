export function downloadBase64(base64, filename) {
    const a = document.createElement("a");
    a.href = base64;
    a.download = filename;
    a.click();
}