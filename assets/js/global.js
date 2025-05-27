// Header Scroll Effect
class HeaderScroll {
    constructor() {
        this.header = document.querySelector('.main-header');
        this.scrollThreshold = 30;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        if (window.scrollY > this.scrollThreshold) {
            this.header.classList.add('header-scrolled');
        } else {
            this.header.classList.remove('header-scrolled');
        }
    }
}

// Search Functionality
class SearchOverlay {
    constructor() {
        this.searchToggle = document.getElementById('searchToggle');
        this.closeSearch = document.getElementById('closeSearch');
        this.searchOverlay = document.getElementById('searchOverlay');
        this.searchInput = document.getElementById('searchInput');
        this.init();
    }

    init() {
        if (this.searchToggle && this.closeSearch && this.searchOverlay) {
            this.searchToggle.addEventListener('click', () => this.openSearch());
            this.closeSearch.addEventListener('click', () => this.closeSearchOverlay());
            this.searchOverlay.addEventListener('click', (e) => {
                if (e.target === this.searchOverlay) {
                    this.closeSearchOverlay();
                }
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.searchOverlay.classList.contains('active')) {
                    this.closeSearchOverlay();
                }
            });
        }
    }

    openSearch() {
        this.searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            this.searchInput.focus();
        }, 300);
    }

    closeSearchOverlay() {
        this.searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        this.searchInput.value = '';
    }
}

// Mobile Menu Functionality
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        this.closeMenu = document.getElementById('closeMenu');
        this.menuState = {
            isOpen: false,
            toggle() {
                this.isOpen = !this.isOpen;
                return this.isOpen;
            }
        };
        this.init();
    }

    init() {
        if (this.menuToggle && this.closeMenu && this.mobileMenu && this.mobileMenuOverlay) {
            this.menuToggle.addEventListener('click', () => this.handleMenuToggle());
            this.closeMenu.addEventListener('click', () => this.handleMenuToggle());
            this.mobileMenuOverlay.addEventListener('click', (e) => this.handleOverlayClick(e));
            
            // Add click event for dropdown toggles
            const dropdownToggles = document.querySelectorAll('.nav-dropdown > a');
            dropdownToggles.forEach(toggle => {
                toggle.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        const dropdown = toggle.parentElement;
                        dropdown.classList.toggle('active');
                    }
                });
            });
        }
    }

    handleMenuToggle() {
        const isOpen = this.menuState.toggle();
        if (isOpen) {
            this.slideInMenu();
        } else {
            this.slideOutMenu();
        }
    }

    slideInMenu() {
        this.mobileMenu.classList.add('mobile-menu-open');
        this.mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    slideOutMenu() {
        this.mobileMenu.classList.remove('mobile-menu-open');
        this.mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleOverlayClick(event) {
        if (event.target === this.mobileMenuOverlay) {
            this.menuState.isOpen = false;
            this.slideOutMenu();
        }
    }
}

// Initialize global components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize header scroll effect
    const headerScroll = new HeaderScroll();
    new MobileMenu();
    new SearchOverlay();
});
