/**
 * Fun Interactive Features for Portfolio
 * Includes:
 * 1. Draggable photo with spring animation
 * 2. Typewriter effect with mistakes
 * 3. Gravity toggle
 * 4. Weather integration
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initDraggablePhoto();
    initTypewriterEffect();
    addGravityToggle();
    addWeatherWidget();
});

/**
 * 1. DRAGGABLE PHOTO WITH SPRING ANIMATION
 */
function initDraggablePhoto() {
    const photo = document.querySelector('.about-info__pic');
    if (!photo) return;

    // Make the photo draggable
    let isDragging = false;
    let originalPosition = { x: 0, y: 0 };
    let currentPosition = { x: 0, y: 0 };
    let dragOffset = { x: 0, y: 0 };

    // Add draggable styles
    photo.style.cursor = 'grab';
    photo.style.position = 'relative';
    photo.style.zIndex = '100';
    photo.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    
    // Store original position
    originalPosition = {
        x: photo.offsetLeft,
        y: photo.offsetTop
    };
    
    // Mouse events
    photo.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // Touch events for mobile
    photo.addEventListener('touchstart', startDragTouch);
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('touchend', endDrag);
    
    function startDrag(e) {
        isDragging = true;
        photo.style.cursor = 'grabbing';
        photo.style.transition = 'none';
        
        dragOffset.x = e.clientX - photo.getBoundingClientRect().left;
        dragOffset.y = e.clientY - photo.getBoundingClientRect().top;
        
        // Prevent default behavior
        e.preventDefault();
    }
    
    function startDragTouch(e) {
        isDragging = true;
        photo.style.cursor = 'grabbing';
        photo.style.transition = 'none';
        
        dragOffset.x = e.touches[0].clientX - photo.getBoundingClientRect().left;
        dragOffset.y = e.touches[0].clientY - photo.getBoundingClientRect().top;
        
        // Prevent default behavior
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        // Calculate new position
        const x = e.clientX - dragOffset.x - originalPosition.x;
        const y = e.clientY - dragOffset.y - originalPosition.y;
        
        // Update position
        currentPosition = { x, y };
        photo.style.transform = `translate(${x}px, ${y}px)`;
        
        // Prevent default behavior
        e.preventDefault();
    }
    
    function dragTouch(e) {
        if (!isDragging) return;
        
        // Calculate new position
        const x = e.touches[0].clientX - dragOffset.x - originalPosition.x;
        const y = e.touches[0].clientY - dragOffset.y - originalPosition.y;
        
        // Update position
        currentPosition = { x, y };
        photo.style.transform = `translate(${x}px, ${y}px)`;
        
        // Prevent default behavior
        e.preventDefault();
    }
    
    function endDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        photo.style.cursor = 'grab';
        
        // Spring animation back to original position
        photo.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        photo.style.transform = 'translate(0, 0)';
        
        // Reset position
        currentPosition = { x: 0, y: 0 };
    }
}

/**
 * 2. TYPEWRITER EFFECT WITH MISTAKES
 */
function initTypewriterEffect() {
    const introTextElement = document.querySelector('.text-huge-title');
    if (!introTextElement) return;
    
    // Store original text
    const originalText = introTextElement.textContent;
    introTextElement.textContent = '';
    
    // Common typos and corrections
    const typos = [
        { index: 5, typo: 'Vednta', correct: 'Vedant' },
        { index: 15, typo: 'pasionate', correct: 'passionate' },
        { index: 25, typo: 'enginering', correct: 'engineering' },
        { index: 40, typo: 'gradaute', correct: 'graduate' }
    ];
    
    // Typewriter settings
    let charIndex = 0;
    let typoTimeout = null;
    const typingSpeed = 70; // milliseconds per character
    const errorPause = 500; // pause before correcting typo
    const backspaceSpeed = 50; // backspace speed
    
    // Start typing
    typeNextChar();
    
    function typeNextChar() {
        // Check if we've reached the end
        if (charIndex >= originalText.length) {
            return;
        }
        
        // Check if we should make a typo
        const typo = typos.find(t => t.index === charIndex);
        
        if (typo) {
            // Type the typo
            typeTypo(typo);
        } else {
            // Type the next character
            introTextElement.textContent += originalText.charAt(charIndex);
            charIndex++;
            
            // Schedule next character
            setTimeout(typeNextChar, typingSpeed);
        }
    }
    
    function typeTypo(typo) {
        // Type the typo character by character
        let typoIndex = 0;
        
        function typeTypoChar() {
            if (typoIndex < typo.typo.length) {
                introTextElement.textContent += typo.typo.charAt(typoIndex);
                typoIndex++;
                setTimeout(typeTypoChar, typingSpeed);
            } else {
                // Pause before correcting
                setTimeout(correctTypo, errorPause, typo);
            }
        }
        
        typeTypoChar();
    }
    
    function correctTypo(typo) {
        // Backspace the typo
        const backspace = setInterval(() => {
            introTextElement.textContent = introTextElement.textContent.slice(0, -1);
            
            if (introTextElement.textContent.length <= charIndex) {
                clearInterval(backspace);
                
                // Type the correct word
                let correctIndex = 0;
                
                const typeCorrection = setInterval(() => {
                    introTextElement.textContent += typo.correct.charAt(correctIndex);
                    correctIndex++;
                    
                    if (correctIndex >= typo.correct.length) {
                        clearInterval(typeCorrection);
                        charIndex += typo.correct.length;
                        setTimeout(typeNextChar, typingSpeed);
                    }
                }, typingSpeed);
            }
        }, backspaceSpeed);
    }
}

/**
 * 3. GRAVITY TOGGLE
 */
function addGravityToggle() {
    // Create the gravity toggle button
    const gravityBtn = document.createElement('button');
    gravityBtn.textContent = 'Toggle Gravity';
    gravityBtn.className = 'gravity-toggle';
    gravityBtn.style.position = 'fixed';
    gravityBtn.style.bottom = '20px';
    gravityBtn.style.right = '20px';
    gravityBtn.style.zIndex = '1000';
    gravityBtn.style.padding = '8px 16px';
    gravityBtn.style.backgroundColor = 'var(--color-1)';
    gravityBtn.style.color = '#000';
    gravityBtn.style.border = 'none';
    gravityBtn.style.borderRadius = '4px';
    gravityBtn.style.cursor = 'pointer';
    gravityBtn.style.fontFamily = 'var(--font-1)';
    gravityBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    // Add to body
    document.body.appendChild(gravityBtn);
    
    // Track original positions of elements
    const elements = [];
    const gravityElements = document.querySelectorAll('.gallery-item, .skills-list li, .about-info__pic, .text-pretitle, .text-huge-title');
    
    gravityElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        
        elements.push({
            element: el,
            originalPosition: {
                top: rect.top,
                left: rect.left
            },
            originalStyles: {
                position: computedStyle.position,
                top: computedStyle.top,
                left: computedStyle.left,
                transition: computedStyle.transition
            }
        });
    });
    
    // Gravity state
    let gravityOn = false;
    
    // Toggle gravity on click
    gravityBtn.addEventListener('click', function() {
        if (!gravityOn) {
            // Turn gravity ON
            gravityBtn.textContent = 'Reset Gravity';
            applyGravity();
        } else {
            // Turn gravity OFF
            gravityBtn.textContent = 'Toggle Gravity';
            resetGravity();
        }
        
        gravityOn = !gravityOn;
    });
    
    function applyGravity() {
        elements.forEach(item => {
            const el = item.element;
            
            // Save current styles
            item.currentStyles = {
                position: el.style.position,
                top: el.style.top,
                left: el.style.left,
                transition: el.style.transition,
                zIndex: el.style.zIndex
            };
            
            // Set up for animation
            el.style.position = 'fixed';
            el.style.top = `${item.originalPosition.top}px`;
            el.style.left = `${item.originalPosition.left}px`;
            el.style.transition = 'top 1.5s cubic-bezier(0.2, 0.8, 0.3, 1.2)';
            el.style.zIndex = '1000';
            
            // Trigger reflow
            void el.offsetWidth;
            
            // Apply gravity - fall to bottom of viewport
            const viewportHeight = window.innerHeight;
            const elHeight = el.offsetHeight;
            el.style.top = `${viewportHeight - elHeight}px`;
        });
    }
    
    function resetGravity() {
        elements.forEach(item => {
            const el = item.element;
            
            // Set up for animation back
            el.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            
            // Trigger reflow
            void el.offsetWidth;
            
            // Reset to original position
            el.style.top = `${item.originalPosition.top}px`;
            el.style.left = `${item.originalPosition.left}px`;
            
            // After animation, restore original styles
            setTimeout(() => {
                el.style.position = item.originalStyles.position;
                el.style.top = item.originalStyles.top;
                el.style.left = item.originalStyles.left;
                el.style.transition = item.originalStyles.transition;
                el.style.zIndex = '';
            }, 800);
        });
    }
}

/**
 * 4. WEATHER WIDGET
 */
function addWeatherWidget() {
    // Create weather widget container
    const weatherWidget = document.createElement('div');
    weatherWidget.className = 'weather-widget';
    weatherWidget.style.position = 'fixed';
    weatherWidget.style.top = '20px';
    weatherWidget.style.right = '20px';
    weatherWidget.style.zIndex = '1000';
    weatherWidget.style.fontSize = '14px';
    weatherWidget.style.fontFamily = 'var(--font-1)';
    weatherWidget.style.color = 'var(--color-1)';
    weatherWidget.style.display = 'flex';
    weatherWidget.style.alignItems = 'center';
    weatherWidget.style.opacity = '0.7';
    weatherWidget.style.transition = 'opacity 0.3s';
    
    // Add hover effect
    weatherWidget.addEventListener('mouseenter', () => {
        weatherWidget.style.opacity = '1';
    });
    
    weatherWidget.addEventListener('mouseleave', () => {
        weatherWidget.style.opacity = '0.7';
    });
    
    // Add to body
    document.body.appendChild(weatherWidget);
    
    // Get user's location and fetch weather
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Use OpenWeatherMap API (free tier)
            const apiKey = ''; // You'll need to get your own API key
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            
            // If no API key, show mock weather
            if (!apiKey) {
                showMockWeather();
                return;
            }
            
            // Fetch weather data
            fetch(weatherUrl)
                .then(response => response.json())
                .then(data => {
                    updateWeatherWidget(data);
                })
                .catch(error => {
                    console.error('Error fetching weather:', error);
                    showMockWeather();
                });
        }, error => {
            console.error('Geolocation error:', error);
            showMockWeather();
        });
    } else {
        showMockWeather();
    }
    
    function updateWeatherWidget(data) {
        const temp = Math.round(data.main.temp);
        const weatherDesc = data.weather[0].main;
        const icon = getWeatherIcon(weatherDesc);
        
        weatherWidget.innerHTML = `
            <span style="margin-right: 5px;">${icon}</span>
            <span>${temp}°C</span>
        `;
    }
    
    function showMockWeather() {
        // Get current season based on month
        const month = new Date().getMonth();
        let season, temp;
        
        // Northern hemisphere seasons
        if (month >= 2 && month <= 4) {
            season = 'Spring';
            temp = Math.floor(Math.random() * 10) + 15; // 15-25°C
        } else if (month >= 5 && month <= 7) {
            season = 'Summer';
            temp = Math.floor(Math.random() * 10) + 25; // 25-35°C
        } else if (month >= 8 && month <= 10) {
            season = 'Autumn';
            temp = Math.floor(Math.random() * 10) + 10; // 10-20°C
        } else {
            season = 'Winter';
            temp = Math.floor(Math.random() * 10); // 0-10°C
        }
        
        const icon = getWeatherIcon(season);
        
        weatherWidget.innerHTML = `
            <span style="margin-right: 5px;">${icon}</span>
            <span>${temp}°C</span>
        `;
    }
    
    function getWeatherIcon(weatherType) {
        // Simple weather icons using Unicode
        const icons = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Fog': '🌫️',
            'Spring': '🌱',
            'Summer': '☀️',
            'Autumn': '🍂',
            'Winter': '❄️'
        };
        
        return icons[weatherType] || '🌡️';
    }
}
