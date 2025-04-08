# Security Recommendations

## API Key Management

This document outlines best practices for API key management in this project.

### Current Implementation

- Environment variables (.env.local) store sensitive Shopify API keys
- Frontend accesses these keys via import.meta.env
- .gitignore excludes .env.local from version control

### Security Improvements

#### Current Limitations
The current implementation exposes the Shopify Storefront Access Token to the client-side. While Storefront API tokens are designed for public use with limited permissions, it's still a best practice to minimize exposure.

#### Recommended Approach
For improved security, consider implementing a backend proxy:

1. **Create a server-side API**:
   ```javascript
   // Example Node.js API endpoint
   app.get('/api/products', async (req, res) => {
     // Use API keys stored securely on the server
     const products = await fetchShopifyProducts();
     res.json(products);
   });
   ```

2. **Update frontend to use your API**:
   ```javascript
   // Frontend code
   const fetchProducts = async () => {
     const response = await fetch('/api/products');
     return response.json();
   };
   ```

#### Additional Security Recommendations

1. **Environment Variables**:
   - Keep using .env.local for development
   - For production, use platform-specific secrets management
   - Never commit .env files to version control

2. **Input Validation**:
   - Validate all inputs before using them to call Shopify APIs
   - Implement rate limiting to prevent abuse

3. **Least Privilege Principle**:
   - Only use tokens with the minimum required permissions
   - Create separate tokens for different functionalities

4. **Monitoring**:
   - Monitor API usage for unusual patterns
   - Set up alerts for suspicious activity

5. **Regular Rotation**:
   - Change API keys periodically
   - Revoke any compromised tokens immediately

6. **HTTPS**:
   - Always use HTTPS for API calls
   - Set the Secure flag on cookies

## Implementation Plan

1. Create a simple Node.js backend API (Express or similar)
2. Move Shopify API interactions to the backend
3. Update the frontend to use your backend API
4. Remove direct Shopify API calls from the client code 