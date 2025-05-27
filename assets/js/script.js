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

// Initialize all components when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const slider = new HeroSlider();

  // Initialize counters
  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    new Counter(counter, target);
  });
});
