/**
 * Shopify Integration
 * 
 * This file handles the Shopify integration using a combination of the Shopify Buy SDK
 * for product display and direct Shopify cart URLs for checkout functionality.
 */

console.log('shopify.js script loaded and executing');

// Initialize the Shopify client for product fetching only
const client = ShopifyBuy.buildClient({
  domain: '9f75fd-70.myshopify.com',
  storefrontAccessToken: 'cc62d28cb17f15fa46ba52533d326f35',
});

// Global variables
let cartItems = [];
const SHOP_DOMAIN = 'https://9f75fd-70.myshopify.com';
const cartStorageKey = 'shopify_cart_items';
const PRIMARY_COLOR = '#6e1b21'; // Maroon
const PRIMARY_HOVER = '#8a2329'; // Darker maroon for hover
const SECONDARY_COLOR = '#e1c9a1'; // Tan

// DOM elements - Only initialize automatically on standalone merch page, not in React component
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the standalone merch page (not in React)
  const isStandaloneMerchPage = window.location.pathname.includes('merch.html');
  
  if (isStandaloneMerchPage) {
    console.log('Initializing on standalone merch page');
    // Load any saved cart items
    loadCartItems();
    
    // Display products
    displayProducts();
    
    // Set up cart UI event listeners
    setupCartEventListeners();
    
    // Update cart UI on page load
    updateCartUI();
  } else {
    console.log('Not standalone merch page, skipping auto-initialization');
  }
});

/**
 * Load cart items from localStorage
 */
function loadCartItems() {
  try {
    const savedCart = localStorage.getItem(cartStorageKey);
    if (savedCart) {
      cartItems = JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    cartItems = [];
  }
}

/**
 * Save cart items to localStorage
 */
function saveCartItems() {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

/**
 * Helper function to get element by multiple possible IDs
 * This allows us to work with both the standalone merch page and the integrated MerchSection
 */
function getElement(idOptions) {
  for (const id of idOptions) {
    const element = document.getElementById(id);
    if (element) return element;
  }
  return null;
}

/**
 * Fetch and display products
 */
function displayProducts() {
  const productsContainer = document.getElementById('shopify-products');
  if (!productsContainer) return;

  // Clear loading indicator once products are loaded
  const clearLoading = () => {
    const loadingEl = productsContainer.querySelector('.loading');
    if (loadingEl) productsContainer.removeChild(loadingEl);
  };

  try {
    // Fetch all products
    const products = client.product.fetchAll();
    
    products.then(products => {
      clearLoading();
  
      if (products.length === 0) {
        productsContainer.innerHTML = '<p class="no-products-message">No products available at this time. Check back soon!</p>';
        return;
      }
  
      // Sort products in the desired order: T-shirt, Hoodie, Hat
      const sortedProducts = [...products].sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        
        // Priority order based on product type
        const getProductPriority = (title) => {
          if (title.includes('t-shirt') || title.includes('tshirt') || title.includes('t shirt')) return 1;
          if (title.includes('hoodie') || title.includes('sweatshirt')) return 2;
          if (title.includes('hat') || title.includes('cap')) return 3;
          return 4; // Other products
        };
        
        return getProductPriority(titleA) - getProductPriority(titleB);
      });
  
      // Display the sorted products
      sortedProducts.forEach(product => {
        // Create HTML elements for each product
        const productElement = createProductElement(product);
        productsContainer.appendChild(productElement);
      });

      // Don't show cart toggle yet - only show when items are added
      // Instead, check if there are already items in the cart
      updateCartVisibility();
    }).catch(error => {
      clearLoading();
      console.error('Failed to fetch products:', error);
      productsContainer.innerHTML = '<p class="error-message">Error loading products. Please try again later.</p>';
    });
  } catch (error) {
    clearLoading();
    console.error('Failed to fetch products:', error);
    productsContainer.innerHTML = '<p class="error-message">Error loading products. Please try again later.</p>';
  }
}

/**
 * Create HTML elements for a product
 */
function createProductElement(product) {
  const div = document.createElement('div');
  div.classList.add('product-item');

  // Product image with toggle functionality
  if (product.images.length > 0) {
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('product-image-container');
    
    const img = document.createElement('img');
    img.src = product.images[0].src;
    img.alt = product.title;
    img.classList.add('product-image');
    
    // Add image toggling functionality if product has multiple images
    if (product.images.length > 1) {
      // Add a visual indicator for image toggling
      const toggleIndicator = document.createElement('div');
      toggleIndicator.classList.add('image-toggle-indicator');
      toggleIndicator.innerHTML = '<span>Click to view back</span>';
      imgContainer.appendChild(toggleIndicator);
      
      // Track current image index
      let currentImageIndex = 0;
      const totalImages = product.images.length;
      
      // Toggle between images on click
      imgContainer.onclick = () => {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        
        // Fade out effect
        img.style.opacity = '0';
        
        // Change image and fade in after a short delay
        setTimeout(() => {
          img.src = product.images[currentImageIndex].src;
          img.style.opacity = '1';
          
          // Update toggle indicator text
          if (currentImageIndex === 0) {
            toggleIndicator.innerHTML = '<span>Click to view back</span>';
          } else {
            toggleIndicator.innerHTML = '<span>Click to view front</span>';
          }
        }, 200);
      };
      
      // Add a visual cursor style to indicate it's clickable
      imgContainer.style.cursor = 'pointer';
    }
    
    imgContainer.appendChild(img);
    div.appendChild(imgContainer);
  }

  // Product info container
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('product-info');
  
  // Product title
  const title = document.createElement('h3');
  title.classList.add('product-title');
  title.textContent = product.title;
  infoDiv.appendChild(title);
  
  // Check if product is a hat - hats typically don't have size variants
  const isHat = product.title.toLowerCase().includes('hat') || 
               product.title.toLowerCase().includes('cap');
  
  // Check if product has actual size variants
  const hasSizeVariants = product.variants.length > 1;
  let selectedVariantId = product.variants[0].id.toString();
  let selectedVariant = product.variants[0];
  
  // Add size selector if product has multiple variants and is not a hat
  if (hasSizeVariants && !isHat) {
    const sizeContainer = document.createElement('div');
    sizeContainer.classList.add('size-selector');
    
    const sizeLabel = document.createElement('label');
    sizeLabel.textContent = 'Size: ';
    sizeLabel.for = `size-select-${product.id}`;
    sizeContainer.appendChild(sizeLabel);
    
    const sizeSelect = document.createElement('select');
    sizeSelect.id = `size-select-${product.id}`;
    sizeSelect.classList.add('size-dropdown');
    
    // Add options for each variant
    product.variants.forEach(variant => {
      const option = document.createElement('option');
      
      // Extract size from variant title or option values
      let size = '';
      
      // First try to extract from title (format: "Product Title - Size")
      if (variant.title && variant.title.includes(' - ')) {
        size = variant.title.split(' - ')[1];
      } 
      // Then try option values if available
      else if (variant.selectedOptions && variant.selectedOptions.length > 0) {
        const sizeOption = variant.selectedOptions.find(opt => 
          opt.name.toLowerCase() === 'size' || 
          opt.name.toLowerCase() === 'size option'
        );
        if (sizeOption) {
          size = sizeOption.value;
        }
      }
      // Fallback to full variant title if no size found
      if (!size && variant.title) {
        size = variant.title;
      }
      
      option.value = variant.id.toString();
      option.textContent = size;
      option.dataset.size = size; // Store size in data attribute for easy access
      sizeSelect.appendChild(option);
    });
    
    // Update selected variant when size changes
    sizeSelect.onchange = (e) => {
      selectedVariantId = e.target.value;
      // Find the selected variant
      selectedVariant = product.variants.find(v => v.id.toString() === selectedVariantId);
      
      // Update price display
      if (selectedVariant) {
        const priceEl = infoDiv.querySelector('.product-price');
        if (priceEl) {
          priceEl.textContent = formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode);
        }
      }
    };
    
    sizeContainer.appendChild(sizeSelect);
    infoDiv.appendChild(sizeContainer);
  }
  
  // Price
  const priceElement = document.createElement('p');
  priceElement.classList.add('product-price');
  
  // Format the price
  const formattedPrice = formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode);
  priceElement.textContent = formattedPrice;
  infoDiv.appendChild(priceElement);
  
  // Add to Cart Button
  const addToCartButton = document.createElement('button');
  addToCartButton.classList.add('add-to-cart');
  addToCartButton.textContent = 'Add to Cart';
  addToCartButton.style.backgroundColor = PRIMARY_COLOR;
  addToCartButton.style.color = 'white';
  
  // Add to cart click handler
  addToCartButton.onclick = () => {
    // Ensure we have the current selectedVariantId (in case it changed)
    const sizeSelect = infoDiv.querySelector('.size-dropdown');
    const currentVariantId = sizeSelect ? sizeSelect.value : selectedVariantId;
    
    // Find the current variant
    const currentVariant = product.variants.find(v => v.id.toString() === currentVariantId);
    
    // Extract variant ID - handle both formats (with or without prefix)
    const variantId = currentVariantId.includes('ProductVariant/') 
      ? currentVariantId.split('ProductVariant/')[1]
      : currentVariantId;
    
    // Get size from the selected option directly - but ignore for hats
    let size = '';
    if (!isHat) {
      if (sizeSelect && sizeSelect.selectedOptions.length > 0) {
        size = sizeSelect.selectedOptions[0].dataset.size || sizeSelect.selectedOptions[0].textContent;
      } else if (currentVariant) {
        // Extract size from variant title
        const variantTitle = currentVariant.title;
        if (variantTitle && variantTitle.includes(' - ')) {
          size = variantTitle.split(' - ')[1];
        } else if (variantTitle && variantTitle !== 'Default Title') {
          size = variantTitle;
        }
      }
      
      // Ensure we have a non-default size value
      if ((!size || size === 'Default Title') && currentVariant) {
        size = '';
      }
    }
    
    addItemToCart(
      variantId, 
      product.title, 
      currentVariant ? currentVariant.price.amount : selectedVariant.price.amount, 
      currentVariant ? currentVariant.price.currencyCode : selectedVariant.price.currencyCode, 
      product.images[0]?.src,
      size
    );
  };
  
  infoDiv.appendChild(addToCartButton);
  
  div.appendChild(infoDiv);
  return div;
}

/**
 * Format price with currency
 */
function formatPrice(amount, currencyCode = 'USD') {
  // Ensure amount is treated as a number
  const numericAmount = parseFloat(amount);
  
  // Format with the browser's Intl API
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(numericAmount);
}

/**
 * Update visibility of cart toggle button based on cart contents
 */
function updateCartVisibility() {
  const cartToggle = getElement(['cart-toggle', 'merch-section-cart-toggle']);
  if (cartToggle) {
    if (cartItems.length > 0) {
      cartToggle.classList.remove('hidden');
      cartToggle.style.display = 'flex';
    } else {
      cartToggle.classList.add('hidden');
      cartToggle.style.display = 'none';
    }
  }
}

/**
 * Add an item to the cart
 */
function addItemToCart(variantId, title, price, currencyCode, imageSrc, size = '') {
  // Create a loading/adding indicator
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const clickedButton = Array.from(addToCartButtons).find(button => 
    button === document.activeElement || button.matches(':active')
  );
  
  // Generate a unique key for the cart item including size
  const itemKey = `${variantId}${size ? '-' + size : ''}`;
  
  // Check if item is already in cart
  const existingItemIndex = cartItems.findIndex(item => 
    item.variantId === variantId && item.size === size
  );
  
  if (existingItemIndex >= 0) {
    // Item exists, increment quantity
    cartItems[existingItemIndex].quantity += 1;
  } else {
    // Add new item to cart
    cartItems.push({
      variantId,
      title,
      price,
      currencyCode,
      imageSrc,
      size,
      quantity: 1
    });
  }
  
  // Save updated cart to localStorage
  saveCartItems();
  
  // Update UI
  updateCartUI();
  
  // Make sure cart toggle is visible now that we have items
  updateCartVisibility();
  
  // Show cart after adding item - using getElement to work with both standalone and integrated versions
  const cart = getElement(['shopify-cart', 'merch-section-cart']);
  const overlay = getElement(['overlay', 'merch-section-overlay']);
  if (cart) cart.classList.add('open');
  if (overlay) overlay.classList.add('active');
  
  // Update button text temporarily for user feedback
  if (clickedButton) {
    const originalText = clickedButton.textContent;
    clickedButton.textContent = 'Added!';
    clickedButton.disabled = true;
    
    setTimeout(() => {
      clickedButton.textContent = originalText;
      clickedButton.disabled = false;
    }, 1000);
  }
}

/**
 * Remove an item from the cart
 */
function removeItemFromCart(variantId, size = '') {
  cartItems = cartItems.filter(item => 
    !(item.variantId === variantId && item.size === size)
  );
  saveCartItems();
  updateCartUI();
  
  // Update cart visibility after removing an item
  updateCartVisibility();
}

/**
 * Update item quantity in the cart
 */
function updateItemQuantity(variantId, quantity, size = '') {
  // Ensure quantity is at least 1
  quantity = Math.max(1, quantity);
  
  const itemIndex = cartItems.findIndex(item => 
    item.variantId === variantId && item.size === size
  );
  if (itemIndex >= 0) {
    cartItems[itemIndex].quantity = quantity;
    saveCartItems();
    updateCartUI();
  }
}

/**
 * Redirect to checkout
 */
function redirectToCheckout() {
  if (cartItems.length === 0) {
    console.error('Cart is empty');
    return;
  }
  
  // Create a form to submit cart items to Shopify
  const form = document.createElement('form');
  form.method = 'post';
  form.action = `${SHOP_DOMAIN}/cart/add`;
  
  // Add items to form
  cartItems.forEach((item, index) => {
    // Create a hidden input for each item's variant ID
    const variantInput = document.createElement('input');
    variantInput.type = 'hidden';
    variantInput.name = `items[${index}][id]`;
    variantInput.value = item.variantId;
    form.appendChild(variantInput);
    
    // Create a hidden input for quantity
    const quantityInput = document.createElement('input');
    quantityInput.type = 'hidden';
    quantityInput.name = `items[${index}][quantity]`;
    quantityInput.value = item.quantity;
    form.appendChild(quantityInput);
  });
  
  // Add a checkout parameter to redirect to checkout
  const checkoutParam = document.createElement('input');
  checkoutParam.type = 'hidden';
  checkoutParam.name = 'checkout';
  checkoutParam.value = 'Checkout';
  form.appendChild(checkoutParam);
  
  // Append form to body and submit it
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

/**
 * Calculate cart total
 */
function calculateCartTotal() {
  return cartItems.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);
}

/**
 * Update the cart UI
 */
function updateCartUI() {
  // Get cart items container and cart count element
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartIconCount = document.getElementById('cart-icon-count');
  const cartTotalAmount = document.getElementById('cart-total-amount');
  
  if (!cartItemsContainer || !cartIconCount || !cartTotalAmount) return;
  
  // Calculate total quantity and amount
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  
  // Update cart count
  cartIconCount.textContent = totalQuantity;
  
  // Update cart visibility based on cart contents
  updateCartVisibility();
  
  // Show empty cart message if no items
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
    cartTotalAmount.textContent = '$0.00';
    
    // Close the cart if it's open
    const cart = getElement(['shopify-cart', 'merch-section-cart']);
    const overlay = getElement(['overlay', 'merch-section-overlay']);
    
    // Add a slight delay to allow users to see the empty cart message
    setTimeout(() => {
      if (cart) cart.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    }, 1500);
    
    return;
  }
  
  // Update cart items display
  cartItemsContainer.innerHTML = '';
  
  cartItems.forEach((item, index) => {
    const cartItemEl = document.createElement('div');
    cartItemEl.classList.add('cart-item');
    
    if (item.size) {
      cartItemEl.dataset.size = item.size;
    }
    
    cartItemEl.innerHTML = `
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.title}</h4>
        ${item.size ? `<div class="cart-item-size">Size: ${item.size}</div>` : ''}
        <div class="cart-item-price">${formatPrice(item.price, item.currencyCode)}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" readonly>
          <button class="quantity-btn increase">+</button>
        </div>
        <button class="remove-item">Remove</button>
      </div>
    `;
    
    // Add event listeners to quantity buttons
    const decreaseBtn = cartItemEl.querySelector('.decrease');
    const increaseBtn = cartItemEl.querySelector('.increase');
    const quantityInput = cartItemEl.querySelector('.quantity-input');
    const removeBtn = cartItemEl.querySelector('.remove-item');
    
    decreaseBtn.addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
        quantityInput.value = item.quantity;
        saveCartItems();
        updateCartUI();
      }
    });
    
    increaseBtn.addEventListener('click', () => {
      if (item.quantity < 99) {
        item.quantity++;
        quantityInput.value = item.quantity;
        saveCartItems();
        updateCartUI();
      }
    });
    
    removeBtn.addEventListener('click', () => {
      removeItemFromCart(item.variantId, item.size);
    });
    
    cartItemsContainer.appendChild(cartItemEl);
  });
  
  // Update total amount
  cartTotalAmount.textContent = formatPrice(totalAmount);
}

/**
 * Set up cart event listeners
 */
function setupCartEventListeners() {
  // Cart toggle button click event
  const cartToggle = getElement(['cart-toggle', 'merch-section-cart-toggle']);
  if (cartToggle) {
    cartToggle.addEventListener('click', () => {
      const cart = getElement(['shopify-cart', 'merch-section-cart']);
      const overlay = getElement(['overlay', 'merch-section-overlay']);
      if (cart) cart.classList.add('open');
      if (overlay) overlay.classList.add('active');
    });
  }
  
  // Close cart button click event
  const closeCartBtn = document.getElementById('close-cart');
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      const cart = getElement(['shopify-cart', 'merch-section-cart']);
      const overlay = getElement(['overlay', 'merch-section-overlay']);
      if (cart) cart.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    });
  }
  
  // Overlay click event to close cart
  const overlay = getElement(['overlay', 'merch-section-overlay']);
  if (overlay) {
    overlay.addEventListener('click', () => {
      const cart = getElement(['shopify-cart', 'merch-section-cart']);
      if (cart) cart.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
  
  // Checkout button click event
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartItems.length === 0) {
        alert('Your cart is empty.');
        return;
      }
      
      // Redirect to Shopify checkout
      redirectToCheckout();
    });
  }
}

// Export functions to window object for use in React component
window.displayProducts = displayProducts;
window.setupCartEventListeners = setupCartEventListeners;
window.updateCartUI = updateCartUI; 