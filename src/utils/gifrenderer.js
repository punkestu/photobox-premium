import GIF from "gif.js";
import LogoTypo from "../assets/Logo_border_typo.webp";

export async function renderGIF(photos) {
    const watermark = await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = LogoTypo;
        img.onload = () => resolve(img);
    });
    const images = await Promise.all(photos.map(photo => new Promise((res) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = photo;
        img.onload = () => res(img);
    })))
    return new Promise((resolve, reject) => {
        const gif = new GIF({
            workers: 2,
            quality: 10,
        });

        images.forEach((img) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;

            const scale = 1 / 4;
            const wmW = canvas.width * scale;
            const wmscale = wmW / watermark.width;
            const wmH = watermark.height * wmscale;

            ctx.drawImage(img, 0, 0);
            ctx.drawImage(watermark, canvas.width - wmW - 16, canvas.height - wmH - 16, wmW, wmH);
            gif.addFrame(canvas, { delay: 500, copy: true });
        });

        gif.on("error", reject);

        gif.on("finished", (blob) => {
            // const url = URL.createObjectURL(blob);
            resolve(blob);
        });

        gif.render();
    });
}