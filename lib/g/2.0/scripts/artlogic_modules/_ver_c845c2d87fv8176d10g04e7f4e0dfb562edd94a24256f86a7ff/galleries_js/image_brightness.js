const calculate_average_rgb = (image_data) => {
    const { length } = image_data.data;
    const rgb = { r: 0, g: 0, b: 0 };
    const chunk_size = 200;

    let count = 0;
    for (
        let i = 0;
        i < length && (i + chunk_size + 2) <= length;
        i += chunk_size, ++count
    ) {
        rgb.r += image_data.data[i];
        rgb.g += image_data.data[i + 1];
        rgb.b += image_data.data[i + 2];
    }

    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;
};

const get_average_color_for_full_image = (image) => {
    const canvas = new OffscreenCanvas(image.naturalWidth, image.naturalHeight);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    const data = context.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
    return calculate_average_rgb(data);
}

const get_average_color_for_area_behind_overlay = (image, overlay) => {
    const { offsetWidth: width, offsetHeight: height, offsetLeft, offsetTop } = overlay;
    const canvas = new OffscreenCanvas(width, height);
    
    const size_multiplier = image.naturalWidth / image.width;
    const context = canvas.getContext('2d');
    
    context.drawImage(
        image,
        offsetLeft * size_multiplier,
        offsetTop * size_multiplier,
        width * size_multiplier,
        height * size_multiplier,
        0, 
        0,
        width,
        height,
    );
    
    const data = context.getImageData(0, 0, width, height);
    return calculate_average_rgb(data);
};

const get_overlay_color_class = ({ r, g, b }) => {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? 'image-overlay-dark' : 'image-overlay-light';
};

const image_brightness = (container_selector, text_overlay_selector, use_full_image = false) => {
    const elements = document.querySelectorAll(container_selector);

    elements.forEach((element) => {
        const overlay = element.querySelector(text_overlay_selector);
        const image = element.querySelector('img');
        
        if (!overlay || !image) {
            return;
        }
        
        image.crossOrigin = 'Anonymous';
        $(element).on('change.lazyload-complete', () => {
            const rgb = use_full_image ? get_average_color_for_full_image(image)
                : get_average_color_for_area_behind_overlay(image, overlay);

            overlay.classList.add(get_overlay_color_class(rgb));
        });
    });
};

window.galleries = window.galleries || {};
window.galleries.image_brightness = image_brightness;

export default image_brightness;
