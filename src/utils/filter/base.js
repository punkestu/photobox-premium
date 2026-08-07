export function applyPhotoboxFilter(imageData, options = {}) {
    const {
        brightness = 15,
        contrast = 1.25,
        saturation = 1.15
    } = options;

    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // brightness + contrast
        r = ((r - 128) * contrast) + 128 + brightness;
        g = ((g - 128) * contrast) + 128 + brightness;
        b = ((b - 128) * contrast) + 128 + brightness;

        // saturation
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;

        data[i]     = clamp(r);
        data[i + 1] = clamp(g);
        data[i + 2] = clamp(b);
    }

    return imageData;
}

function clamp(value) {
    return Math.max(0, Math.min(255, value));
}