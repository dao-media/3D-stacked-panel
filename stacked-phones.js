/**
 * 3D Stacked Phone Images Component
 * Interactive stacked phone layout with hover and touch support
 */

class StackedPhones {
  constructor(container) {
    this.container = container;
    this.phoneCards = container.querySelectorAll('.phone-card');
    this.activeCard = null;
    this.overlays = [];
    
    // Configuration
    this.config = {
      debugMode: false, // Set to true to visualize touch areas
      enableClickOutside: true,
      overlayVisibleWidths: [180, 100, 100], // Full width, partial width, partial width
      overlayLeftPositions: [0, 200, 320] // Left positions for overlays
    };
    
    if (!container || this.phoneCards.length === 0) {
      console.warn('StackedPhones: Container or phone cards not found');
      return;
    }
    
    this.init();
  }
  
  /**
   * Initialize the component
   */
  init() {
    this.createTouchOverlays();
    this.bindEvents();
    
    if (this.config.debugMode) {
      this.enableDebugMode();
    }
  }
  
  /**
   * Create invisible touch overlays for mobile interaction
   */
  createTouchOverlays() {
    const overlayConfigs = [
      {
        className: 'click-overlay click-overlay-1',
        phoneNumber: '1',
        fullWidth: true
      },
      {
        className: 'click-overlay click-overlay-2', 
        phoneNumber: '2',
        fullWidth: false
      },
      {
        className: 'click-overlay click-overlay-3',
        phoneNumber: '3', 
        fullWidth: false
      }
    ];
    
    overlayConfigs.forEach((config, index) => {
      const overlay = document.createElement('div');
      overlay.className = config.className;
      overlay.setAttribute('data-phone', config.phoneNumber);
      overlay.setAttribute('aria-label', `View phone ${config.phoneNumber}`);
      
      this.container.appendChild(overlay);
      this.overlays.push(overlay);
    });
  }
  
  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Touch overlay events
    this.overlays.forEach((overlay) => {
      overlay.addEventListener('click', this.handleOverlayClick.bind(this));
      overlay.addEventListener('touchend', this.handleOverlayTouch.bind(this));
    });
    
    // Click outside to deactivate
    if (this.config.enableClickOutside) {
      document.addEventListener('click', this.handleClickOutside.bind(this));
    }
  }
  
  /**
   * Handle overlay click events
   */
  handleOverlayClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const phoneNumber = e.target.getAttribute('data-phone');
    this.togglePhone(phoneNumber);
  }
  
  /**
   * Handle overlay touch events
   */
  handleOverlayTouch(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const phoneNumber = e.target.getAttribute('data-phone');
    this.togglePhone(phoneNumber);
  }
  
  /**
   * Handle clicks outside the container
   */
  handleClickOutside(e) {
    if (!e.target.closest('.phone-stack-container') && this.activeCard) {
      this.deactivateAll();
    }
  }
  
  /**
   * Toggle phone active state
   */
  togglePhone(phoneNumber) {
    const cardClass = `phone-${phoneNumber}-active`;
    
    // If clicking the same card that's already active, deactivate it
    if (this.container.classList.contains(cardClass)) {
      this.deactivateAll();
      return;
    }
    
    // Remove all active classes
    this.deactivateAll();
    
    // Add active class for clicked card
    this.container.classList.add(cardClass);
    this.activeCard = phoneNumber;
    
    // Dispatch custom event
    this.dispatchEvent('phoneActivated', { phoneNumber });
  }
  
  /**
   * Deactivate all phones
   */
  deactivateAll() {
    this.container.classList.remove('phone-1-active', 'phone-2-active', 'phone-3-active');
    this.activeCard = null;
    
    // Dispatch custom event
    this.dispatchEvent('phoneDeactivated');
  }
  
  /**
   * Enable debug mode to visualize touch areas
   */
  enableDebugMode() {
    this.overlays.forEach(overlay => {
      overlay.style.background = 'rgba(255, 0, 0, 0.3)';
      overlay.style.border = '2px solid red';
    });
  }
  
  /**
   * Dispatch custom events
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail: { ...detail, instance: this },
      bubbles: true
    });
    this.container.dispatchEvent(event);
  }
  
  /**
   * Public API Methods
   */
  
  /**
   * Activate specific phone
   */
  activatePhone(phoneNumber) {
    this.togglePhone(phoneNumber.toString());
  }
  
  /**
   * Get currently active phone
   */
  getActivePhone() {
    return this.activeCard;
  }
  
  /**
   * Update overlay positions (useful for responsive changes)
   */
  updateOverlayPositions(positions) {
    if (positions && positions.length === 3) {
      this.config.overlayLeftPositions = positions;
      // Update overlay styles here if needed
    }
  }
  
  /**
   * Destroy the component
   */
  destroy() {
    // Remove event listeners
    this.overlays.forEach(overlay => {
      overlay.removeEventListener('click', this.handleOverlayClick);
      overlay.removeEventListener('touchend', this.handleOverlayTouch);
      overlay.remove();
    });
    
    if (this.config.enableClickOutside) {
      document.removeEventListener('click', this.handleClickOutside);
    }
    
    // Clean up
    this.overlays = [];
    this.activeCard = null;
  }
}

/**
 * Auto-initialize all stacked phone components on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  const containers = document.querySelectorAll('.phone-stack-container');
  
  // Store instances for potential later access
  window.stackedPhones = [];
  
  containers.forEach(container => {
    const stackedPhone = new StackedPhones(container);
    window.stackedPhones.push(stackedPhone);
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StackedPhones;
}
