# Shopify Integration Implementation Plan

**Goal:** Integrate Shopify merchandise display and cart functionality directly into the existing website, allowing users to browse products and manage their cart on-site, redirecting only for the final checkout process.

**Method:** Shopify JavaScript Buy SDK (using the Storefront API).

---

## 1. Prerequisites (Shopify Admin Setup)

Before coding begins, the following needs to be configured in the Shopify Admin panel:

1.  **Create a Private App (or use an existing one):**
    *   Navigate to `Apps` -> `Develop apps for your store`.
    *   Click `Create an app`. Name it appropriately (e.g., "Website Integration").
    *   Under `Configuration` -> `Storefront API integration`, click `Configure`.
2.  **Configure Storefront API Scopes:**
    *   Grant the necessary permissions. Minimally, you will need:
        *   `unauthenticated_read_product_listings`: To fetch products, collections, variants.
        *   `unauthenticated_write_checkouts`: To create carts/checkouts.
        *   `unauthenticated_read_checkouts`: To retrieve existing checkouts (useful for persisting carts, though might not be implemented initially).
    *   *Note:* Grant only the permissions required. Avoid granting write access to products or customer data unless explicitly needed for a feature.
3.  **Obtain Credentials:**
    *   Once configured, navigate to the `API credentials` tab for the app.
    *   Copy the **Storefront API access token**.
    *   Note down your **Shopify Domain** (e.g., `your-shop-name.myshopify.com`).

**Required Information for Development:**
*   Storefront API Access Token
*   Shopify Domain

---

## 2. SDK Setup & Initialization

1.  **Include SDK:**
    *   Add the Shopify Buy SDK script to the HTML file(s) where the store functionality will reside (e.g., `store.html` or `index.html`). Preferably place it just before the closing `</body>` tag, or in the `<head>` with the `defer` attribute.
    *   ```html
      <script src="https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js"></script>
      ```
2.  **Initialize Client:**
    *   In a new or existing JavaScript file (e.g., `shopify.js`), initialize the SDK client using the credentials obtained in Step 1.
    *   ```javascript
      // shopify.js
      const client = ShopifyBuy.buildClient({
        domain: '9f75fd-70.myshopify.com', // Replace with your domain
        storefrontAccessToken: 'cc62d28cb17f15fa46ba52533d326f35', // Replace with your token
      });

      let cart = null; // Variable to hold the cart state
      const cartIdKey = 'shopify_cart_id'; // Key for storing cart ID in localStorage

      // Function to initialize or retrieve the cart
      async function initializeCart() {
        const existingCartId = localStorage.getItem(cartIdKey);
        if (existingCartId) {
          try {
            cart = await client.checkout.fetch(existingCartId);
            // Check if the checkout is already completed
            if (cart.completedAt) {
              cart = await client.checkout.create();
              localStorage.setItem(cartIdKey, cart.id);
            }
          } catch (error) {
            console.error('Failed to fetch existing cart, creating a new one.', error);
            localStorage.removeItem(cartIdKey); // Remove invalid ID
            cart = await client.checkout.create();
            localStorage.setItem(cartIdKey, cart.id);
          }
        } else {
          cart = await client.checkout.create();
          localStorage.setItem(cartIdKey, cart.id);
        }
        // Update cart UI after initialization
        updateCartUI();
      }
      ```
    *   Ensure this initialization code runs after the page loads and the SDK script is available.
    *   Implement basic cart persistence using `localStorage` to keep the cart active across page loads/refreshes.

---

## 3. Product Display

1.  **Define Storefront Location:**
    *   Create a new HTML file (e.g., `store.html`) or designate a specific section (e.g., `<div id="shopify-products"></div>`) in an existing page where products will be displayed.
2.  **Fetch Products:**
    *   Use the initialized `client` object to fetch products or collections.
    *   ```javascript
      // Function to fetch and display products
      async function displayProducts() {
        const productsContainer = document.getElementById('shopify-products'); // Target container
        if (!productsContainer) return; // Exit if container not found

        try {
          // Example: Fetch all products
          const products = await client.product.fetchAll();

          // Example: Fetch products from a specific collection (more common)
          // const collectionId = 'gid://shopify/Collection/YOUR_COLLECTION_ID'; // Find this ID via Shopify Admin URL or API
          // const collection = await client.collection.fetchWithProducts(collectionId);
          // const products = collection.products;

          productsContainer.innerHTML = ''; // Clear existing content

          products.forEach(product => {
            // Create HTML elements for each product
            const productElement = createProductElement(product);
            productsContainer.appendChild(productElement);
          });
        } catch (error) {
          console.error('Failed to fetch products:', error);
          productsContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
        }
      }

      // Helper function to create product HTML
      function createProductElement(product) {
        const div = document.createElement('div');
        div.classList.add('product-item'); // Add CSS class for styling

        // Basic product display (customize as needed)
        const title = document.createElement('h3');
        title.textContent = product.title;
        div.appendChild(title);

        if (product.images.length > 0) {
          const img = document.createElement('img');
          img.src = product.images[0].src;
          img.alt = product.title;
          img.style.maxWidth = '200px'; // Basic styling example
          div.appendChild(img);
        }

        const price = document.createElement('p');
        // Display the price of the first variant
        price.textContent = `Price: ${product.variants[0].price.amount} ${product.variants[0].price.currencyCode}`;
        div.appendChild(price);

        // Add to Cart Button (using the first variant's ID)
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.onclick = () => addItemToCart(product.variants[0].id, 1); // Pass variant ID and quantity
        div.appendChild(addToCartButton);

        // Add more details: description, variants dropdown, etc.

        return div;
      }
      ```
3.  **Render Products:**
    *   Call the `displayProducts()` function when the store page/section loads.
    *   The `createProductElement` helper needs to be implemented to generate the desired HTML structure for each product (image, title, price, variants selector if applicable, add-to-cart button).

---

## 4. Cart Management

1.  **Add to Cart Functionality:**
    *   The "Add to Cart" buttons generated in Step 3 should trigger a function (`addItemToCart`).
    *   This function uses the SDK to add the selected variant (`variantId`) and quantity to the current `cart`.
    *   ```javascript
      // Function to add an item to the cart
      async function addItemToCart(variantId, quantity) {
        if (!cart) {
          console.error('Cart not initialized.');
          await initializeCart(); // Try initializing again if cart is missing
          if (!cart) return; // Exit if still not initialized
        }

        const lineItemsToAdd = [{ variantId, quantity }];

        try {
          cart = await client.checkout.addLineItems(cart.id, lineItemsToAdd);
          console.log('Item added:', cart.lineItems);
          // Update the cart UI after adding an item
          updateCartUI();
        } catch (error) {
          console.error('Failed to add item to cart:', error);
          // Provide user feedback (e.g., display an error message)
        }
      }
      ```
2.  **Display Cart:**
    *   Create an HTML element (e.g., `<div id="shopify-cart"></div>`) to display cart contents. This could be a modal, sidebar, or part of the main layout.
    *   Implement an `updateCartUI()` function to render the current state of the `cart`.
    *   ```javascript
      // Function to update the cart display
      function updateCartUI() {
        const cartContainer = document.getElementById('shopify-cart');
        const cartIcon = document.getElementById('cart-icon-count'); // Optional: For cart count display
        if (!cartContainer) return;

        cartContainer.innerHTML = ''; // Clear previous content

        if (!cart || cart.lineItems.length === 0) {
          cartContainer.innerHTML = '<p>Your cart is empty.</p>';
          if (cartIcon) cartIcon.textContent = '0';
          return;
        }

        let totalItems = 0;
        const ul = document.createElement('ul');

        cart.lineItems.forEach(item => {
          totalItems += item.quantity;
          const li = document.createElement('li');
          li.textContent = `${item.title} (Qty: ${item.quantity}) - ${item.variant.price.amount} ${item.variant.price.currencyCode}`;

          // Add remove button
          const removeButton = document.createElement('button');
          removeButton.textContent = 'Remove';
          removeButton.style.marginLeft = '10px';
          removeButton.onclick = () => removeItemFromCart(item.id);
          li.appendChild(removeButton);

          // TODO: Add quantity update controls if desired

          ul.appendChild(li);
        });

        cartContainer.appendChild(ul);

        // Display Subtotal
        const subtotal = document.createElement('p');
        subtotal.textContent = `Subtotal: ${cart.subtotalPrice.amount} ${cart.subtotalPrice.currencyCode}`;
        cartContainer.appendChild(subtotal);

        // Add Checkout Button
        const checkoutButton = document.createElement('button');
        checkoutButton.textContent = 'Checkout';
        checkoutButton.onclick = goToCheckout;
        cartContainer.appendChild(checkoutButton);

        // Update cart icon count (if applicable)
        if (cartIcon) cartIcon.textContent = totalItems.toString();
      }
      ```
3.  **Remove/Update Cart Items:**
    *   Implement functions (`removeItemFromCart`, `updateItemQuantity` - optional) using SDK methods like `client.checkout.removeLineItems` and `client.checkout.updateLineItems`.
    *   Update the UI accordingly after modification.
    *   ```javascript
      // Function to remove an item from the cart
      async function removeItemFromCart(lineItemId) {
        if (!cart) return;
        try {
          cart = await client.checkout.removeLineItems(cart.id, [lineItemId]);
          updateCartUI();
        } catch (error) {
          console.error('Failed to remove item:', error);
        }
      }
      ```

---

## 5. Checkout Process

1.  **Generate Checkout URL:**
    *   The "Checkout" button within the cart UI should trigger a `goToCheckout` function.
    *   This function retrieves the `webUrl` property from the `cart` object.
    *   ```javascript
      // Function to redirect to Shopify checkout
      function goToCheckout() {
        if (!cart || !cart.webUrl) {
          console.error('Cart or checkout URL not available.');
          return;
        }
        // Redirect the user to Shopify's secure checkout
        window.location.href = cart.webUrl;
      }
      ```
2.  **Redirection:**
    *   Redirect the user's browser to the `cart.webUrl`. This takes them off-site to the secure Shopify checkout page, pre-populated with their cart items.

---

## 6. Styling

1.  **CSS:**
    *   Create CSS rules to style the product listings (`.product-item`), cart display (`#shopify-cart`), buttons, and other generated elements.
    *   Ensure the styling matches the overall aesthetic of the existing website.
    *   Use CSS classes consistently on dynamically generated elements to facilitate styling.

---

## 7. Development Plan & Execution

1.  **Setup:** Obtain Shopify credentials and add/initialize the SDK in the relevant HTML/JS files. Implement `initializeCart`.
2.  **Product Display:** Create the target HTML container. Implement `displayProducts` and `createProductElement` to fetch and render products.
3.  **Cart Core:** Implement `addItemToCart`. Create the cart HTML container and implement `updateCartUI` (basic version showing items and count).
4.  **Cart Refinements:** Implement `removeItemFromCart` and add corresponding controls to the UI. Add subtotal and checkout button display.
5.  **Checkout:** Implement `goToCheckout` function triggered by the checkout button.
6.  **Styling:** Apply CSS to match the site design.
7.  **Testing:** Thoroughly test fetching products, adding/removing items, quantity updates (if implemented), and the checkout redirection across different browsers/devices. Test edge cases like empty cart, failed API calls, and fetching an already completed cart ID from local storage.

---

This document provides a comprehensive guide. Specific implementation details (like exact HTML structure, CSS classes, or advanced features like variant selection) will be determined during the coding 