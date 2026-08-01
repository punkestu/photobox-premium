export async function preloadFrames() {
    const frames = import.meta.glob(
        "../assets/framessingle/*.{png,jpg,jpeg,webp,svg}",
        {
            eager: true,
            import: "default",
        }
    );

    await Promise.all(
        Object.values(frames).map(
            (src) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = src;
                })
        )
    );
}