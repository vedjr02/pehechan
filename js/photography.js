document.addEventListener('DOMContentLoaded', function() {
    // Remove preloader immediately
    document.body.classList.remove('ss-preload');
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
    
    // Get all gallery images
    const galleryImages = document.querySelectorAll('.gallery-image img');
    
    // Process images in batches to improve performance
    const processBatch = (startIndex, batchSize) => {
        const endIndex = Math.min(startIndex + batchSize, galleryImages.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const img = galleryImages[i];
            img.setAttribute('loading', 'lazy');
            
            // Add loading class
            img.parentElement.classList.add('loading');
            
            // Remove loading class when image is loaded
            img.onload = function() {
                img.parentElement.classList.remove('loading');
            };
            
            // Handle error
            img.onerror = function() {
                img.parentElement.classList.remove('loading');
                img.parentElement.classList.add('error');
            };
        }
        
        // Process next batch if needed
        if (endIndex < galleryImages.length) {
            setTimeout(() => {
                processBatch(endIndex, batchSize);
            }, 100);
        }
    };
    
    // Start processing images in batches of 8
    processBatch(0, 8);

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
});
