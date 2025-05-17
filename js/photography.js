document.addEventListener('DOMContentLoaded', function() {
    // Remove preloader immediately
    document.body.classList.remove('ss-preload');
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
    
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxLoading = lightbox.querySelector('.lightbox-loading');
    const closeButton = lightbox.querySelector('.lightbox-close');
    
    // Function to open the lightbox
    function openLightbox(imagePath) {
        // Show loading indicator
        lightboxLoading.style.display = 'block';
        lightboxImg.style.opacity = '0';
        
        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Create a new image to preload
        const preloadImg = new Image();
        
        preloadImg.onload = function() {
            // Once loaded, update lightbox image
            lightboxImg.src = imagePath;
            setTimeout(() => {
                lightboxImg.style.opacity = '1';
                lightboxLoading.style.display = 'none';
            }, 100);
        };
        
        preloadImg.onerror = function() {
            // Handle error
            lightboxLoading.style.display = 'none';
            alert('Failed to load image');
        };
        
        // Start loading
        preloadImg.src = imagePath;
    }
    
    // Function to close the lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Clear the image src to stop any ongoing downloads
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }
    
    // Add click event to each gallery item
    galleryItems.forEach(item => {
        // Get the image path from data attribute
        const imagePath = item.getAttribute('data-img');
        
        // Add click event
        item.addEventListener('click', () => {
            openLightbox(imagePath);
        });
        
        // Create background style with a small colored gradient
        const placeholder = item.querySelector('.placeholder');
        const hue = Math.floor(Math.random() * 360); // Random hue
        placeholder.style.background = `linear-gradient(45deg, hsl(${hue}, 15%, 20%), hsl(${hue}, 15%, 30%))`;
    });
    
    // Close lightbox events
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
