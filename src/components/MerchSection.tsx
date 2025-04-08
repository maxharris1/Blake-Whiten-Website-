import { useEffect, useRef } from 'react';

const MerchSection = () => {
  const initialized = useRef(false);

  useEffect(() => {
    // Debug function to help identify issues
    const debugScriptStatus = () => {
      console.log('ShopifySDK loaded:', !!document.querySelector('script[src*="buy-button-storefront"]'));
      console.log('ShopifyScript loaded:', !!document.querySelector('script[src*="shopify.js"]'));
      console.log('Window functions available:', {
        displayProducts: typeof window.displayProducts === 'function',
        setupCartEventListeners: typeof window.setupCartEventListeners === 'function',
        updateCartUI: typeof window.updateCartUI === 'function',
      });
      console.log('Products container exists:', !!document.getElementById('shopify-products'));
    };

    // Add necessary CSS styles for cart elements
    const addCartStyles = () => {
      const styleEl = document.createElement('style');
      styleEl.id = 'merch-section-styles';
      styleEl.textContent = `
        #merch-section-cart.open {
          right: 0 !important;
        }
        #merch-section-overlay.active {
          display: block !important;
        }
        #merch-section-cart-toggle {
          display: none !important; /* Initially hidden, will be shown by JS when cart has items */
          width: 50px !important;
          height: 50px !important;
          border-radius: 50% !important;
          align-items: center !important;
          justify-content: center !important;
        }
        #merch-section-cart-toggle.hidden {
          display: none !important;
        }
        #merch-section-cart-toggle:not(.hidden) {
          display: flex !important;
        }
        #merch-section-cart-toggle span.cart-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }
        /* Updated cart and checkout styling */
        #merch-section-cart {
          background-color: #1a1a1a;
          color: white;
        }
        .cart-header h2 {
          color: #e1c9a1;
        }
        .cart-header {
          border-color: #2a2a2a;
        }
        .cart-footer {
          border-color: #2a2a2a;
        }
        .cart-total {
          color: #e1c9a1;
        }
        .checkout-btn {
          background-color: #6e1b21 !important;
          color: white !important;
          transition: background-color 0.3s ease;
        }
        .checkout-btn:hover {
          background-color: #8a2329 !important;
        }
        .cart-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #2a2a2a;
          position: relative;
        }
        .cart-item-title {
          color: white;
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }
        .cart-item-price {
          font-size: 0.875rem;
          color: #e1c9a1;
          margin-bottom: 0.5rem;
        }
        .cart-item-size {
          font-size: 0.9rem;
          color: #e1c9a1;
          margin-bottom: 0.5rem;
          font-weight: 500;
          background-color: rgba(110, 27, 33, 0.1);
          display: inline-block;
          padding: 3px 8px;
          border-radius: 3px;
          border-left: 2px solid #6e1b21;
        }
        .cart-item-quantity {
          display: flex;
          align-items: center;
          margin: 0.75rem 0;
        }
        .quantity-btn {
          background: #6e1b21;
          border: none;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          font-weight: bold;
          border-radius: 4px;
        }
        .quantity-input {
          width: 40px;
          height: 28px;
          text-align: center;
          border: 1px solid #2a2a2a;
          margin: 0 0.5rem;
          background-color: #2a2a2a;
          color: white;
        }
        .remove-item {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 0.75rem;
          text-decoration: underline;
          margin-top: 0.5rem;
          align-self: flex-start;
        }
        .remove-item:hover {
          color: #6e1b21;
        }
        .product-item {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
          background-color: #1a1a1a;
          border: 1px solid #2a2a2a;
        }
        .product-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(110, 27, 33, 0.3);
        }
        .product-info {
          padding: 1.25rem;
          background-color: #1a1a1a;
        }
        .product-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.2rem;
          color: white;
        }
        .product-price {
          font-weight: bold;
          margin-bottom: 1rem;
          color: #e1c9a1;
        }
        /* Updated Add to Cart button styling */
        .add-to-cart {
          background-color: #6e1b21;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.3s ease;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.8rem;
        }
        .add-to-cart:hover {
          background-color: #8a2329;
        }
        .size-selector {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }
        .size-selector label {
          margin-right: 0.5rem;
          color: white;
          font-size: 0.9rem;
        }
        .size-dropdown {
          background-color: #2a2a2a;
          border: 1px solid #3a3a3a;
          color: white;
          padding: 0.5rem;
          border-radius: 4px;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          flex-grow: 1;
        }
        .product-image-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 1/1;
          background-color: #ffffff;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background-color: #ffffff;
          display: block;
          transition: opacity 0.2s ease-in-out;
        }
        .image-toggle-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 5px 0;
          text-align: center;
          font-size: 0.8rem;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        .product-image-container:hover .image-toggle-indicator {
          transform: translateY(0);
        }
        .empty-cart-message {
          color: #777;
          text-align: center;
          padding: 1rem 0;
        }
      `;
      document.head.appendChild(styleEl);
    };

    // Check if we need to load scripts
    const shopifySDK = document.querySelector('script[src*="buy-button-storefront"]');
    const shopifyScript = document.querySelector('script[src*="shopify.js"]');

    // Elements we'll need to move to body
    const cartElement = document.getElementById('merch-section-cart');
    const overlayElement = document.getElementById('merch-section-overlay');
    const cartToggleElement = document.getElementById('merch-section-cart-toggle');

    // Add styles
    if (!document.getElementById('merch-section-styles')) {
      addCartStyles();
    }

    // Run debug to see current status
    debugScriptStatus();

    // Move cart, overlay and toggle to body
    if (cartElement) document.body.appendChild(cartElement);
    if (overlayElement) document.body.appendChild(overlayElement);
    if (cartToggleElement) document.body.appendChild(cartToggleElement);

    // Only initialize once to prevent duplicate calls
    if (!initialized.current) {
      initialized.current = true;

      // Inject environment variables into window object for shopify.js to use
      window.SHOPIFY_ENV = {
        DOMAIN: import.meta.env.VITE_SHOPIFY_DOMAIN || '9f75fd-70.myshopify.com',
        STOREFRONT_ACCESS_TOKEN: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'cc62d28cb17f15fa46ba52533d326f35'
      };

      // Load Shopify SDK if not already loaded
      if (!shopifySDK) {
        console.log('Loading Shopify SDK...');
        const script = document.createElement('script');
        script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
        script.async = true;
        script.onload = () => {
          console.log('Shopify SDK loaded successfully');
          // Load our custom shopify.js script if not already loaded
          if (!shopifyScript) {
            console.log('Loading shopify.js...');
            const customScript = document.createElement('script');
            customScript.src = './shopify.js'; // Use relative path instead of absolute
            customScript.onload = () => {
              console.log('shopify.js loaded successfully');
              setTimeout(() => {
                debugScriptStatus();
                if (window.displayProducts) {
                  console.log('Initializing displayProducts...');
                  window.displayProducts();
                  window.setupCartEventListeners();
                  window.updateCartUI();
                } else {
                  console.error('displayProducts function not found after script load');
                }
              }, 500);
            };
            document.body.appendChild(customScript);
          } else {
            // If script already exists, manually initialize the products
            if (window.displayProducts && window.setupCartEventListeners && window.updateCartUI) {
              console.log('Initializing with existing shopify.js...');
              window.displayProducts();
              window.setupCartEventListeners();
              window.updateCartUI();
            } else {
              console.error('Required functions not found on window object');
            }
          }
        };
        document.body.appendChild(script);
      } else if (!shopifyScript) {
        // If SDK exists but custom script doesn't
        console.log('SDK exists, loading shopify.js...');
        const customScript = document.createElement('script');
        customScript.src = './shopify.js'; // Use relative path instead of absolute
        customScript.onload = () => {
          console.log('shopify.js loaded successfully');
          setTimeout(() => {
            debugScriptStatus();
            if (window.displayProducts) {
              window.displayProducts();
              window.setupCartEventListeners();
              window.updateCartUI();
            }
          }, 500);
        };
        document.body.appendChild(customScript);
      } else {
        // Both scripts exist, manually initialize
        console.log('Both scripts already exist, initializing...');
        if (window.displayProducts && window.setupCartEventListeners && window.updateCartUI) {
          setTimeout(() => {
            window.displayProducts();
            window.setupCartEventListeners();
            window.updateCartUI();
          }, 500); // Small timeout to ensure DOM is ready
        } else {
          console.error('Both scripts exist but required functions not found');
          debugScriptStatus();
        }
      }
    }

    // Clean up on component unmount
    return () => {
      // Move elements back to prevent them from being orphaned
      if (cartElement && document.body.contains(cartElement)) {
        document.body.removeChild(cartElement);
      }
      if (overlayElement && document.body.contains(overlayElement)) {
        document.body.removeChild(overlayElement);
      }
      if (cartToggleElement && document.body.contains(cartToggleElement)) {
        document.body.removeChild(cartToggleElement);
      }
      // Remove added styles
      const styleEl = document.getElementById('merch-section-styles');
      if (styleEl) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  return (
    <section id="merch" className="py-16 pt-24 md:pt-16 bg-dark text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#e1c9a1' }}>MERCHANDISE</h2>
        
        {/* Products will be displayed here */}
        <div id="shopify-products" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="loading flex justify-center items-center col-span-full">
            <div className="loading-spinner animate-spin h-12 w-12 border-4 border-maroon border-t-transparent rounded-full"></div>
          </div>
        </div>
        
        {/* Cart toggle button - will be moved to body and initially hidden, shown when cart has items */}
        <div className="fixed bottom-8 right-8 bg-maroon text-white shadow-lg cursor-pointer z-50 hidden" id="merch-section-cart-toggle">
          <span className="cart-icon">🛒</span>
          <span className="absolute -top-2 -right-2 bg-tan text-maroon text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center" id="cart-icon-count">0</span>
        </div>
        
        {/* Cart sidebar - will be moved to body */}
        <div id="merch-section-cart" className="fixed top-0 right-[-350px] w-[350px] h-screen bg-[#1a1a1a] shadow-lg p-8 overflow-y-auto transition-all ease-in-out duration-300 z-50">
          <div className="cart-header flex justify-between items-center mb-6 border-b border-[#2a2a2a] pb-4">
            <h2 className="text-tan text-xl font-semibold">Your Cart</h2>
            <button className="close-cart bg-transparent border-none text-2xl cursor-pointer text-white" id="close-cart">✕</button>
          </div>
          <div className="cart-items mb-6" id="cart-items">
            {/* Cart items will be added here dynamically */}
            <div className="empty-cart-message text-gray-400">Your cart is empty</div>
          </div>
          <div className="cart-footer border-t border-[#2a2a2a] pt-4">
            <div className="cart-total flex justify-between mb-4 font-bold text-tan">
              <span>Total:</span>
              <span id="cart-total-amount">$0.00</span>
            </div>
            <button className="checkout-btn bg-maroon text-white border-none py-3 px-4 rounded cursor-pointer w-full text-base transition-colors hover:bg-[#8a2329]" id="checkout-btn">Checkout</button>
          </div>
        </div>
        
        {/* Overlay for cart sidebar - will be moved to body */}
        <div id="merch-section-overlay" className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 hidden"></div>
      </div>
    </section>
  );
};

// Add type declarations for the global functions from shopify.js
declare global {
  interface Window {
    displayProducts: () => void;
    setupCartEventListeners: () => void;
    updateCartUI: () => void;
    SHOPIFY_ENV?: {
      DOMAIN: string;
      STOREFRONT_ACCESS_TOKEN: string;
    }
  }
}

export default MerchSection; 