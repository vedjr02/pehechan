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
            
            // Store the full-size image path in a data attribute
            const fullSizePath = img.getAttribute('src');
            img.setAttribute('data-full-size', fullSizePath);
            
            // Create thumbnail path by replacing the original path
            // This assumes you'll create thumbnails with the same names in a thumbnails subfolder
            const thumbnailPath = fullSizePath.replace('/photography/', '/photography/thumbnails/');
            
            // Set the source to the thumbnail
            // For now, we'll use the same image but in production you'd create actual thumbnails
            img.setAttribute('src', fullSizePath);
            
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
                // If thumbnail fails, try loading original
                if (img.getAttribute('src') !== fullSizePath) {
                    img.setAttribute('src', fullSizePath);
                }
            };
        }
        
        // Process next batch if needed
        if (endIndex < galleryImages.length) {
            setTimeout(() => {
                processBatch(endIndex, batchSize);
            }, 100);
        }
    };
    
    // Start processing images in batches of 4
    processBatch(0, 4);

    // Lightbox functionality
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'lightbox-loading';
    lightbox.appendChild(loadingIndicator);

    // Open lightbox with full-size image
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            // Show loading indicator
            loadingIndicator.style.display = 'block';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Get full-size image path
            const fullSizePath = img.getAttribute('data-full-size');
            
            // Create a new image to preload
            const preloadImg = new Image();
            preloadImg.onload = function() {
                // Once loaded, update lightbox image
                lightboxImg.src = fullSizePath;
                loadingIndicator.style.display = 'none';
            };
            
            preloadImg.onerror = function() {
                // If full-size fails, use current image
                lightboxImg.src = img.src;
                loadingIndicator.style.display = 'none';
            };
            
            // Start loading
            preloadImg.src = fullSizePath;
        });
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        // Clear the image src to stop any ongoing downloads
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
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
