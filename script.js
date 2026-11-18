// Mobile Menu Functions - Global scope
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        // Remove any existing event listeners
        mobileMenuToggle.removeEventListener('click', toggleMobileMenu);
        
        // Add click event listener
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);

        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('.nav-link');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

// Toggle function for mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && mobileMenuToggle) {
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    }
}

// Banner Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const heroTexts = document.querySelectorAll('.hero-text');
    let currentSlide = 0;
    let slideInterval;

    // Function to show a specific slide
    function showSlide(slideIndex) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        heroTexts.forEach(text => text.classList.remove('active'));

        // Add active class to current slide and indicator
        if (slides[slideIndex]) {
            slides[slideIndex].classList.add('active');
        }
        if (indicators[slideIndex]) {
            indicators[slideIndex].classList.add('active');
        }
        if (heroTexts[slideIndex]) {
            heroTexts[slideIndex].classList.add('active');
        }

        currentSlide = slideIndex;
    }

    // Function to go to next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    // Function to start auto-play
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Function to stop auto-play
    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    // Add click event listeners to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoPlay();
            showSlide(index);
            startAutoPlay(); // Restart auto-play after manual selection
        });
    });

    // Add hover events to pause/resume auto-play
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoPlay);
        heroSection.addEventListener('mouseleave', startAutoPlay);
    }

    // Initialize the carousel
    showSlide(0);
    startAutoPlay();

    // Testimonials Carousel Functionality
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialIndicators = document.querySelectorAll('.testimonial-indicator');
    let currentTestimonial = 0;
    let testimonialInterval;

    // Function to show a specific testimonial
    function showTestimonial(testimonialIndex) {
        // Remove active class from all testimonial slides and indicators
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        testimonialIndicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current testimonial slide and indicator
        testimonialSlides[testimonialIndex].classList.add('active');
        testimonialIndicators[testimonialIndex].classList.add('active');

        currentTestimonial = testimonialIndex;
    }

    // Function to go to next testimonial
    function nextTestimonial() {
        const nextIndex = (currentTestimonial + 1) % testimonialSlides.length;
        showTestimonial(nextIndex);
    }

    // Add click event listeners to testimonial indicators
    testimonialIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(testimonialInterval);
            showTestimonial(index);
            testimonialInterval = setInterval(nextTestimonial, 4000);
        });
    });

    // Initialize testimonials carousel
    if (testimonialSlides.length > 0) {
        showTestimonial(0);
        testimonialInterval = setInterval(nextTestimonial, 4000);
    }

    // Initialize mobile menu
    initializeMobileMenu();
});

// Fallback mobile menu initialization (outside DOMContentLoaded)
// This ensures mobile menu works even if there are issues with the main event listener
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are loaded
    setTimeout(initializeMobileMenu, 100);
});

// Also initialize on window load as a final fallback
window.addEventListener('load', function() {
    setTimeout(initializeMobileMenu, 200);
});

// Scroll Animation Functionality
function initializeScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // On mobile, immediately reveal collection items
    const isMobile = window.innerWidth <= 768;
    
    scrollElements.forEach(element => {
        // If it's a collection item on mobile, reveal it immediately
        if (isMobile && element.closest('.collection-section')) {
            element.classList.add('revealed');
            element.style.opacity = '1';
            element.style.transform = 'none';
        } else {
            // Check if element is already in view on load (especially important for mobile)
            const rect = element.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInView) {
                element.classList.add('revealed');
            }
        }
        observer.observe(element);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
    initializeCollectionGallery();
    initializeCollectionModal();
});

// Collection data with names and prices
const collectionData = {
    'summer-rain': { name: 'SUMMER RAIN DRESS', price: '265k' },
    'nova-001': { name: 'NOVA 001', price: '218k' },
    'nova-002': { name: 'NOVA 002', price: '211k' },
    'tiara': { name: 'TIARA DRESS', price: '120k' },
    'ripple': { name: 'THE RIPPLE DRESS', price: '250k' },
    'bloom': { name: 'BLOOM DRESS', price: '186k' },
    'velora': { name: 'VELORA DRESS', price: '375k' }
};

// Collection Gallery Functionality
function initializeCollectionGallery() {
    const collectionItems = document.querySelectorAll('.collection-item');
    
    collectionItems.forEach(item => {
        const prevBtn = item.querySelector('.gallery-prev');
        const nextBtn = item.querySelector('.gallery-next');
        const images = item.querySelectorAll('.gallery-main-image img');
        const viewDetailsBtn = item.querySelector('.view-details-btn');
        
        if (prevBtn && nextBtn && images.length > 1) {
            let currentImageIndex = 0;
            
            // Show first image initially
            images.forEach((img, index) => {
                img.style.display = index === 0 ? 'block' : 'none';
            });
            
            // Next button functionality
            nextBtn.addEventListener('click', () => {
                images[currentImageIndex].style.display = 'none';
                currentImageIndex = (currentImageIndex + 1) % images.length;
                images[currentImageIndex].style.display = 'block';
            });
            
            // Previous button functionality
            prevBtn.addEventListener('click', () => {
                images[currentImageIndex].style.display = 'none';
                currentImageIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
                images[currentImageIndex].style.display = 'block';
            });
        }
        
        // Handle view details button
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => {
                const category = item.getAttribute('data-category');
                const collectionInfo = collectionData[category];
                
                if (collectionInfo) {
                    showCollectionModal(collectionInfo.name, collectionInfo.price);
                }
            });
        }
    });
}

// Show collection details modal
function showCollectionModal(collectionName, price) {
    const modal = document.getElementById('collectionModal');
    const modalCollectionName = document.getElementById('modalCollectionName');
    
    if (modal && modalCollectionName) {
        modalCollectionName.textContent = collectionName;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

// Close collection modal
function closeCollectionModal() {
    const modal = document.getElementById('collectionModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Initialize modal functionality
function initializeCollectionModal() {
    const modal = document.getElementById('collectionModal');
    const closeBtn = document.querySelector('.close');
    const closeModalBtn = document.querySelector('.modal-close-btn');
    
    if (modal) {
        // Close modal when clicking the X button
        if (closeBtn) {
            closeBtn.addEventListener('click', closeCollectionModal);
        }
        
        // Close modal when clicking the Close button
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeCollectionModal);
        }
        
        // Close modal when clicking outside of it
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCollectionModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeCollectionModal();
            }
        });
    }
}