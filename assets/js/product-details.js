document.addEventListener('DOMContentLoaded', () => {
    const mainImageContainer = document.querySelector('.main-image');
    const mainImage = mainImageContainer.querySelector('img');
    const thumbnailsContainer = document.querySelector('.thumbnail-images');
    const thumbnails = thumbnailsContainer.querySelectorAll('.thumbnail-item img');
    const prevBtn = document.querySelector('.main-image .fa-chevron-left').closest('button');
    const nextBtn = document.querySelector('.main-image .fa-chevron-right').closest('button');
    const zoomIndicator = document.querySelector('.main-image .zoom-indicator');

    let currentIndex = 0;
    let isZoomed = false;

    // Function to update main image and active thumbnail
    const updateImage = (index) => {
        mainImage.src = thumbnails[index].src;
        thumbnails.forEach((thumb, i) => {
            thumb.parentElement.classList.remove('active');
            if (i === index) {
                thumb.parentElement.classList.add('active');
            }
        });
        currentIndex = index;
        // Reset zoom when image changes
        mainImageContainer.classList.remove('zoomed');
        mainImage.style.transformOrigin = 'center center';
        isZoomed = false;
    };

    // Initial state: set the first thumbnail as active
    if (thumbnails.length > 0) {
        updateImage(0);
    }

    // Thumbnail click handler
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.parentElement.addEventListener('click', () => {
            updateImage(index);
        });
    });

    // Previous button handler
    prevBtn.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        updateImage(newIndex);
    });

    // Next button handler
    nextBtn.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % thumbnails.length;
        updateImage(newIndex);
    });

    // Zoom functionality triggered by indicator click
    if (zoomIndicator) {
        zoomIndicator.addEventListener('click', (e) => {
            e.stopPropagation();
            mainImageContainer.classList.toggle('zoomed');
            isZoomed = mainImageContainer.classList.contains('zoomed');
            // Reset transform origin when zooming out
            if (!isZoomed) {
                mainImage.style.transformOrigin = 'center center';
            }
        });
    }

    // Cursor-based zoom when zoomed class is active
    mainImageContainer.addEventListener('mousemove', (e) => {
        if (isZoomed) {
            const { left, top, width, height } = mainImageContainer.getBoundingClientRect();
            const x = (e.clientX - left) / width * 100;
            const y = (e.clientY - top) / height * 100;
            mainImage.style.transformOrigin = `${x}% ${y}%`;
        }
    });

    // Reset zoom on main image click when zoomed
    mainImage.addEventListener('click', () => {
        if (isZoomed) {
            mainImageContainer.classList.remove('zoomed');
            mainImage.style.transformOrigin = 'center center';
            isZoomed = false;
        }
    });
});
