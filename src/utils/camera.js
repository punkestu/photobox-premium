var stream = null;

export async function init(screenRef) {
    try {
        if (!stream) {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    aspectRatio: {
                        ideal: 4 / 3
                    },
                    width: {
                        ideal: 1440
                    },
                    height: {
                        ideal: 1080
                    }
                },
                audio: false
            });

            const screen = screenRef.current;
            screen.srcObject = stream;
        }

        if (!document.querySelector("#___snapshot_canvas")) {
            const canvas = document.createElement("canvas");
            canvas.id = "___snapshot_canvas";
            canvas.style.display = "none";
            document.body.appendChild(canvas);
        }
        console.log("Camera initiated");

    } catch (error) {
        console.error("Camera initialization failed:", error);
        alert("Camera Error!");
    }
}

export function close(screenRef) {
    const screen = screenRef.current;
    if (screen) {
        screen.pause();
        screen.srcObject = null;
    }

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    const canvas = document.querySelector("#___snapshot_canvas");
    if (canvas) {
        canvas.remove();
    }
    console.log("Camera closed");
}

export function capture(screenRef) {
    const screen = screenRef.current;
    const canvas = document.querySelector("#___snapshot_canvas");
    const context = canvas.getContext("2d");
    canvas.width = screen.videoWidth;
    canvas.height = screen.videoHeight;
    context.drawImage(
        screen,
        0,
        0,
        canvas.width,
        canvas.height
    );
    const image = canvas.toDataURL("image/jpeg", 0.9);
    return image;
}