let wakeLock = null;

export async function enableWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request("screen");
        console.log("Screen wake lock enabled");

        wakeLock.addEventListener("release", () => {
            console.log("Screen wake lock released");
        });
    } catch (err) {
        console.error(err);
    }
}