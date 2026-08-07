import { applyPhotoboxFilter } from "./filter/base";
import { PHOTOBOX_PRESETS } from "./filter/presets";

export async function render(displayRef, photos, frame, frametype, preset) {
    if (!displayRef) return;
    if (!document.querySelector("#___rendering_canvas")) {
        const canvas = document.createElement("canvas");
        canvas.id = "___rendering_canvas";
        canvas.style.display = "none";
        document.body.appendChild(canvas);
    }
    const canvas = document.querySelector("#___rendering_canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = frametype.width;
    canvas.height = frametype.height;

    const images = await Promise.all(photos.map(photo => new Promise((res) => {
        const img = new Image();
        img.onload = () => {
            res(img);
        };
        img.src = photo;
    })));

    if (!frame) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
    const ratiox = frametype && frametype.ratio ? frametype.ratio[0] : 4;
    const ratioy = frametype && frametype.ratio ? frametype.ratio[1] : 3;
    const ratio = ratiox / ratioy;
    // console.log(frametype.ratio[0], frametype.ratio[1]);

    if (frametype.direction == "vertical") {
        images.forEach((img, i) => {
            var imgwidth = img.height * ratio;
            if (imgwidth > img.width) {
                imgwidth = img.width;
            }
            var imgheight = imgwidth / ratio;

            const imgtocanvasratio = (canvas.width - (frametype.offsetleft + frametype.offsetright)) / imgwidth;
            const imgwidthrender = imgwidth * imgtocanvasratio;
            const imgheightrender = imgwidthrender / ratio;
            console.log(imgwidth / imgheight, imgwidthrender / imgheightrender, ratio);
            console.log(img.width, img.height);
            console.log(imgwidth, imgheight);
            console.log(imgwidthrender, imgheightrender);
            ctx.drawImage(
                img,
                img.width / 2 - imgwidth / 2,
                img.height / 2 - imgheight / 2,
                imgwidth,
                imgheight,
                frametype.offsetleft,
                i * imgheightrender + (i * frametype.gap) + frametype.offsettop,
                imgwidthrender,
                imgheightrender
            );
        });
    } else if (frametype.direction == "horizontal") {
        images.forEach((img, i) => {
            const wmth = img.width >= img.height; // is img width is more than img height
            const imgwidth = wmth ? ratio * img.height : img.width;
            const imgheight = wmth ? img.height : 1 / ratio * img.width;
            const imgtocanvasratio = (canvas.height - (frametype.offsettop + frametype.offsetbottom)) / imgheight;
            ctx.drawImage(
                img,
                img.width / 2 - imgwidth / 2,
                img.height / 2 - imgheight / 2,
                imgwidth,
                imgheight,
                i * imgwidth * imgtocanvasratio + (i * frametype.gap) + frametype.offsetleft,
                frametype.offsettop,
                imgwidth * imgtocanvasratio,
                imgheight * imgtocanvasratio
            );
        });
    }

    const imageData = ctx.getImageData(0,
        0,
        canvas.width,
        canvas.height
    );

    const presetData = preset ? PHOTOBOX_PRESETS[preset] : PHOTOBOX_PRESETS["natural"];

    const filtered = applyPhotoboxFilter(imageData, presetData ?? {
        brightness: 20,
        contrast: 1.35,
        saturation: 1.2
    });

    ctx.putImageData(filtered, 0, 0);

    if (frame) {
        const frameImage = await new Promise((res) => {
            const img = new Image();
            img.onload = () => {
                res(img);
            };
            img.src = frame;
        });
        ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    }

    renderCanvasToImage(canvas, displayRef.current, 1);
    return canvas.toDataURL(
        "image/jpeg",
        1
    );
}

function renderCanvasToImage(canvas, imgElement, scale = 0.5) {
    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.width * scale;
    tempCanvas.height = canvas.height * scale;

    console.log(canvas.width, canvas.height);

    ctx.drawImage(
        canvas,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
    );

    imgElement.src = tempCanvas.toDataURL(
        "image/jpeg",
        0.9
    );
}