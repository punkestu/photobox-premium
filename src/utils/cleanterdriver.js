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
    const res = await fetch(`${BRIDGE_URL}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "type": "image", "base64": base64Image, "align": "center" }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Print failed: ${res.status} ${err.detail ?? ""}`);
    }
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