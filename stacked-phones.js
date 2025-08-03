/**
 * 3D Stacked Phone Images Component
 * Interactive stacked phone layout with click-based toggle on all devices
 */

class StackedPhones {
  constructor(container) {
    this.container = container;
    this.phoneCards = container.querySelectorAll('.phone-card');
    this.activeCard = null;
    this.overlays = [];
    
    // Configuration
    this.config = {
      debugMode: false, // Set to true to visualize click areas
      enableClickOutside: true,
      overlayVisibleWidths: [180, 100, 100], // Full width, partial width, partial width
      overlayLeftPositions: [0, 200, 320], // Left positions for overlays
      enableHoverFeedback: true // Subtle visual feedback on hover (desktop)
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
    this.createClickOverlays();
    this.bindEvents();
    
    if (this.config.debugMode) {
      this.enableDebugMode();
    }
  }
  
  /**
   * Create click overlays for all device interaction
   */
  createClickOverlays() {
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
      overlay.setAttribute('aria-label', `Toggle phone ${config.phoneNumber}`);
      overlay.setAttribute('role', 'button');
      overlay.setAttribute('tabindex', '0');
      
      this.container.appendChild(overlay);
      this.overlays.push(overlay);
    });
  }
  
  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Click overlay events - unified for all devices
    this.overlays.forEach((overlay) => {
      // Mouse events
      overlay.addEventListener('click', this.handleInteraction.bind(this));
      
      // Touch events (with preventDefault to avoid double-firing)
      overlay.addEventListener('touchend', this.handleTouchInteraction.bind(this));
      
      // Keyboard accessibility
      overlay.addEventListener('keydown', this.handleKeyboard.bind(this));
    });
    
    // Click outside to deactivate
    if (this.config.enableClickOutside) {
      document.addEventListener('click', this.handleClickOutside.bind(this));
    }
  }
  
  /**
   * Handle standard click/interaction events
   */
  handleInteraction(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const phoneNumber = e.target.getAttribute('data-phone');
    this.togglePhone(phoneNumber);
  }
  
  /**
   * Handle touch events with double-tap prevention
   */
  handleTouchInteraction(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const phoneNumber = e.target.getAttribute('data-phone');
    this.togglePhone(phoneNumber);
  }
  
  /**
   * Handle keyboard interaction
   */
  handleKeyboard(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      
      const phoneNumber = e.target.getAttribute('data-phone');
      this.togglePhone(phoneNumber);
    }
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
    
    // Update ARIA states
    this.updateAriaStates(phoneNumber);
    
    // Dispatch custom event
    this.dispatchEvent('phoneActivated', { phoneNumber });
  }
  
  /**
   * Deactivate all phones
   */
  deactivateAll() {
    this.container.classList.remove('phone-1-active', 'phone-2-active', 'phone-3-active');
    this.activeCard = null;
    
    // Reset ARIA states
    this.updateAriaStates(null);
    
    // Dispatch custom event
    this.dispatchEvent('phoneDeactivated');
  }
  
  /**
   * Update ARIA states for accessibility
   */
  updateAriaStates(activePhoneNumber) {
    this.overlays.forEach((overlay, index) => {
      const phoneNumber = (index + 1).toString();
      const isActive = phoneNumber === activePhoneNumber;
      
      overlay.setAttribute('aria-pressed', isActive.toString());
      overlay.setAttribute('aria-expanded', isActive.toString());
    });
  }
  
  /**
   * Enable debug mode to visualize click areas
   */
  enableDebugMode() {
    this.overlays.forEach(overlay => {
      overlay.style.background = 'rgba(255, 0, 0, 0.3)';
      overlay.style.border = '2px solid red';
      overlay.style.opacity = '0.8';
    });
    
    console.log('StackedPhones Debug Mode: Click areas are now visible');
  }
  
  /**
   * Disable debug mode
   */
  disableDebugMode() {
    this.overlays.forEach(overlay => {
      overlay.style.background = 'transparent';
      overlay.style.border = 'none';
      overlay.style.opacity = '1';
    });
    
    this.config.debugMode = false;
    console.log('StackedPhones Debug Mode: Disabled');
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
   * Check if a phone is active
   */
  isPhoneActive(phoneNumber) {
    return this.activeCard === phoneNumber.toString();
  }
  
  /**
   * Toggle debug mode
   */
  toggleDebugMode() {
    this.config.debugMode = !this.config.debugMode;
    
    if (this.config.debugMode) {
      this.enableDebugMode();
    } else {
      this.disableDebugMode();
    }
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
   * Get all phone numbers
   */
  getPhoneNumbers() {
    return ['1', '2', '3'];
  }
  
  /**
   * Programmatically cycle through phones
   */
  cycleToNext() {
    const phones = this.getPhoneNumbers();
    const currentIndex = phones.indexOf(this.activeCard);
    const nextIndex = (currentIndex + 1) % phones.length;
    
    if (currentIndex === -1) {
      // No phone active, activate first
      this.activatePhone(phones[0]);
    } else {
      // Activate next phone
      this.activatePhone(phones[nextIndex]);
    }
  }
  
  /**
   * Destroy the component
   */
  destroy() {
    // Remove event listeners
    this.overlays.forEach(overlay => {
      overlay.removeEventListener('click', this.handleInteraction);
      overlay.removeEventListener('touchend', this.handleTouchInteraction);
      overlay.removeEventListener('keydown', this.handleKeyboard);
      overlay.remove();
    });
    
    if (this.config.enableClickOutside) {
      document.removeEventListener('click', this.handleClickOutside);
    }
    
    // Clean up
    this.overlays = [];
    this.activeCard = null;
    
    console.log('StackedPhones: Component destroyed');
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
  
  if (containers.length > 0) {
    console.log(`StackedPhones: Initialized ${containers.length} component(s)`);
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StackedPhones;
}
