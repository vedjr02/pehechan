document.addEventListener('DOMContentLoaded', function() {
    // Add loading="lazy" to all gallery images
    const galleryImages = document.querySelectorAll('.gallery-image img');
    galleryImages.forEach(img => {
        img.setAttribute('loading', 'lazy');
        
        // Add loading class for spinner
        img.parentElement.classList.add('loading');
        
        // Remove loading class when image is loaded
        img.onload = function() {
            img.parentElement.classList.remove('loading');
        };
    });

    // Lightbox functionality
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const closeButton = lightbox.querySelector('.lightbox-close');

    // Open lightbox
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    };

    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Preload visible images first
    const preloadVisibleImages = () => {
        const viewportHeight = window.innerHeight;
        galleryImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            // If image is in viewport or close to it
            if (rect.top >= -viewportHeight && rect.top <= viewportHeight * 2) {
                const src = img.getAttribute('src');
                if (src) {
                    const preloadImg = new Image();
                    preloadImg.src = src;
                }
            }
        });
    };

    // Initial preload
    preloadVisibleImages();

    // Preload on scroll
    window.addEventListener('scroll', preloadVisibleImages, { passive: true });
});
