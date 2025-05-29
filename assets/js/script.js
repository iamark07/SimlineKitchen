// Hero Slider
class HeroSlider {
  constructor() {
    this.slider = document.querySelector(".hero-slider");
    this.items = this.slider.querySelectorAll(".slider-item");
    this.dots = this.slider.querySelectorAll(".slider-dot");
    this.prevBtn = this.slider.querySelector(".prev-arrow");
    this.nextBtn = this.slider.querySelector(".next-arrow");
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000;
    this.isTransitioning = false;

    // Set first slide as active when page loads
    this.items[0].classList.add('active');
    this.dots[0].classList.add('active');

    this.init();
  }

  init() {
    // Initialize event listeners
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    // Start auto-play
    this.startAutoPlay();

    // Pause auto-play on hover
    this.slider.addEventListener("mouseenter", () => this.stopAutoPlay());
    this.slider.addEventListener("mouseleave", () => this.startAutoPlay());

    // Preload images
    this.preloadImages();
  }

  preloadImages() {
    this.items.forEach((item) => {
      const image = item.querySelector(".slider-image");
      const bgImage = image.style.backgroundImage;
      const url = bgImage.slice(4, -1).replace(/["']/g, "");
      const img = new Image();
      img.src = url;
    });
  }

  updateSlider() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Update slides
    this.items.forEach((item, index) => {
      item.classList.toggle("active", index === this.currentIndex);
    });

    // Update dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex);
    });

    // Reset transition state after animation
    setTimeout(() => {
      this.isTransitioning = false;
    }, 800); // Match this with CSS transition duration
  }

  nextSlide() {
    if (this.isTransitioning) return;
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateSlider();
  }

  prevSlide() {
    if (this.isTransitioning) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateSlider();
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    this.currentIndex = index;
    this.updateSlider();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(
      () => this.nextSlide(),
      this.autoPlayDelay
    );
  }

  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }
}

// Counter Animation
class Counter {
  constructor(element, target, duration = 2000) {
    this.element = element;
    this.target = target;
    this.duration = duration;
    this.start = 0;
    this.current = 0;
    this.increment = target / (duration / 16);
    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startCounting();
            observer.unobserve(this.element);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(this.element);
  }

  startCounting() {
    const animate = () => {
      this.current += this.increment;
      if (this.current < this.target) {
        this.element.textContent = Math.floor(this.current);
        requestAnimationFrame(animate);
      } else {
        this.element.textContent = this.target;
      }
    };
    animate();
  }
}

// Product Category Filtering and Display
document.addEventListener('DOMContentLoaded', function() {
    const categoryDropdownBtn = document.getElementById('categoryDropdownBtn');
    const categoryOptions = document.getElementById('categoryOptions');
    const categoryOptionBtns = document.querySelectorAll('.category-option');
    const selectedCategoryText = document.getElementById('selectedCategoryText');
    const productCards = document.querySelectorAll('.product-card'); // Select all static product cards

    // Toggle category options dropdown
    if (categoryDropdownBtn && categoryOptions) {
        categoryDropdownBtn.addEventListener('click', function() {
            categoryOptions.classList.toggle('show');
            categoryDropdownBtn.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!categoryDropdownBtn.contains(event.target) && !categoryOptions.contains(event.target)) {
                categoryOptions.classList.remove('show');
                categoryDropdownBtn.classList.remove('active');
            }
        });
    }

    // Function to filter products based on category
    function filterProducts(category) {
        productCards.forEach(card => {
            const productCategory = card.getAttribute('data-category');
            if (category === 'all' || productCategory === category) {
                card.style.display = ''; // Show the card
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });
    }

    // Add event listeners to category options
    categoryOptionBtns.forEach(option => {
        option.addEventListener('click', function() {
            const selectedCategory = this.getAttribute('data-category');
            selectedCategoryText.textContent = this.textContent;
            filterProducts(selectedCategory);

            // Update active class on category options
            categoryOptionBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Close dropdown after selection
            if (categoryOptions) {
                 categoryOptions.classList.remove('show');
                 if (categoryDropdownBtn) {
                    categoryDropdownBtn.classList.remove('active');
                 }
            }
        });
    });

    // Initial display: show all products
    filterProducts('all');

    // Handle click on "View Details" buttons (do nothing for now)
    const viewDetailsBtns = document.querySelectorAll('.btn-view-details');
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default button behavior
            // No action is taken for now as per requirement
        });
    });
});

// Add fade-in animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize components when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const slider = new HeroSlider();

  // Initialize counters
  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    new Counter(counter, target);
  });
});


// Initialize Owl Carousel for Testimonials
$(document).ready(function () {
  $('.testimonial-carousel').owlCarousel({
      loop: true,
      margin: 20,
      nav: true,
      dots: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      smartSpeed: 1000,
      navText: [
          '<i class="fas fa-chevron-left"></i>',
          '<i class="fas fa-chevron-right"></i>'
      ],
      responsive: {
          0: {
              items: 1,
              margin: 5
          },
          768: {
              items: 2,
              margin: 15
          },
          1280: {
              items: 3,
              margin: 20
          }
      }
  });
});