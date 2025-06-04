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

// landing page form validation
document.addEventListener('DOMContentLoaded', function() {
    // Function to initialize form validation for a given form
    function initializeFormValidation(formId, inputConfig) {
        const form = document.getElementById(formId);
        if (!form) {
            console.error(`Form element with ID "${formId}" not found!`);
            return;
        }

        // Map input keys to their elements, errors, and validation logic
        const inputs = {};
        Object.entries(inputConfig).forEach(([key, config]) => {
            const inputElement = document.getElementById(config.inputId);
            if (!inputElement) {
                console.error(`Form input element with ID "${config.inputId}" for key "${key}" not found!`);
                return;
            }
            inputs[key] = {
                input: inputElement,
                error: createErrorElement(),
                validate: config.validate
            };
        });

        checkInputElements(inputs);
        addErrorElements(inputs);
        setupRealtimeValidation(inputs);
        form.addEventListener('submit', (e) => handleFormSubmit(e, inputs, form));
        console.log(`Form validation initialized for form ID: ${formId}`);
    }

    function createErrorElement() {
        const error = document.createElement('p');
        error.className = 'text-red-500 text-xs mt-1 error-message';
        error.style.display = 'none';
        return error;
    }

    function checkInputElements(inputsMap) {
        Object.keys(inputsMap).forEach(key => {
            if (!inputsMap[key].input) {
                console.error(`Input element for key "${key}" is missing in the inputs map.`);
            }
        });
    }

    function addErrorElements(inputsMap) {
        Object.values(inputsMap).forEach(({input, error}) => {
            if (input && input.parentNode) {
                let container = input.closest('.form-group');
                if (container) {
                    container.appendChild(error);
                } else {
                    if (input.tagName === 'SELECT' && input.parentNode.classList.contains('relative')) {
                        input.parentNode.after(error);
                    } else {
                        input.after(error);
                    }
                }
            }
        });
    }

    function validateInput(key, inputsMap) {
        const {input, error, validate} = inputsMap[key];
        if (!input || !error) return false;

        const value = input.value;
        const errorMessage = validate(value);

        if (errorMessage) {
            error.textContent = errorMessage;
            error.style.display = 'block';
            input.classList.add('border-red-500');
            input.classList.remove('border-gray-200');
            if (input.tagName === 'SELECT' && input.parentNode.classList.contains('relative')) {
                input.parentNode.classList.add('border-red-500');
                input.parentNode.classList.remove('border-gray-200');
            }
            return false;
        } else {
            error.style.display = 'none';
            input.classList.remove('border-red-500');
            input.classList.add('border-gray-200');
            if (input.tagName === 'SELECT' && input.parentNode.classList.contains('relative')) {
                input.parentNode.classList.remove('border-red-500');
                input.parentNode.classList.add('border-gray-200');
            }
            return true;
        }
    }

    function validateForm(inputsMap) {
        let isValid = true;
        Object.keys(inputsMap).forEach(key => {
            if (!validateInput(key, inputsMap)) {
                isValid = false;
            }
        });
        return isValid;
    }

    function setupRealtimeValidation(inputsMap) {
        Object.entries(inputsMap).forEach(([key, {input}]) => {
            if (!input) return;

            if (key === 'phone') {
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    validateInput(key, inputsMap);
                });
                input.addEventListener('blur', () => validateInput(key, inputsMap));
            }
            else if (key === 'name') {
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\d/g, '');
                    validateInput(key, inputsMap);
                });
                input.addEventListener('blur', () => validateInput(key, inputsMap));
            }
            else if (key === 'subject') {
                input.addEventListener('change', () => validateInput(key, inputsMap));
                input.addEventListener('blur', () => validateInput(key, inputsMap));
            }
            else {
                input.addEventListener('input', () => validateInput(key, inputsMap));
                input.addEventListener('blur', () => validateInput(key, inputsMap));
            }
        });
    }

    function showSuccessMessage(formElement) {
        removeMessageElements();

        const successMessage = document.createElement('div');
        successMessage.className = 'success-message mt-4 p-3 text-center rounded-lg text-green-700 bg-green-100 border border-green-200';
        successMessage.textContent = 'Thank you for your message. We will get back to you soon!';

        if (formElement && formElement.parentNode) {
            formElement.parentNode.insertBefore(successMessage, formElement.nextSibling);
            successMessage.style.display = 'block';
        }

        setTimeout(() => {
            if (successMessage && successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 5000);
    }

    function removeMessageElements() {
        const existingMessages = document.querySelectorAll('.success-message, .error-message-submission');
        existingMessages.forEach(msg => msg.parentNode.removeChild(msg));
    }

    async function handleFormSubmit(e, inputsMap, formElement) {
        e.preventDefault();
        removeMessageElements();

        const isFormValid = validateForm(inputsMap);

        if (!isFormValid) {
            const firstInvalidKey = Object.keys(inputsMap).find(key => !validateInput(key, inputsMap));
            if (firstInvalidKey && inputsMap[firstInvalidKey].input) {
                const targetInput = inputsMap[firstInvalidKey].input;
                targetInput.focus();
                targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        showSuccessMessage(formElement);
        formElement.reset();
        Object.values(inputsMap).forEach(({input, error}) => {
            if (input) {
                input.classList.remove('border-red-500');
                input.classList.add('border-gray-200');
                if (input.tagName === 'SELECT' && input.parentNode.classList.contains('relative')) {
                    input.parentNode.classList.remove('border-red-500');
                    input.parentNode.classList.add('border-gray-200');
                }
            }
            if (error) {
                error.style.display = 'none';
            }
        });
    }

    // Define configuration for the contact form in index.html
    const indexContactFormConfig = {
        name: {
            inputId: 'nameIndex',
            validate: (value) => {
                if (!value.trim()) return 'This field is required';
                if (value.length < 3) return 'Name must be at least 3 characters';
                if (value.length > 60) return 'Name cannot exceed 60 characters';
                if (/\d/.test(value)) return 'Name cannot contain numbers';
                return '';
            }
        },
        email: {
            inputId: 'emailIndex',
            validate: (value) => {
                if (!value.trim()) return 'This field is required';
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';
            }
        },
        phone: {
            inputId: 'phoneIndex',
            validate: (value) => {
                if (!value.trim()) return 'This field is required';
                if (!/^[6-9]/.test(value)) return 'Phone number must start with 6, 7, 8, or 9';
                if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
                return '';
            }
        },
        subject: {
            inputId: 'subjectIndex',
            validate: (value) => {
                if (!value || value === '') return 'Please select a subject';
                return '';
            }
        },
        message: {
            inputId: 'messageIndex',
            validate: (value) => {
                if (!value.trim()) return 'This field is required';
                if (value.length < 10) return 'Message must be at least 10 characters';
                return '';
            }
        }
    };

    // Initialize validation for the contact form in index.html
    initializeFormValidation('contactFormIndex', indexContactFormConfig);
});