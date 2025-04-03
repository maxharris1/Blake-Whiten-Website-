import { useEffect } from 'react';

export const useHashScroll = () => {
  useEffect(() => {
    // Function to scroll to element based on hash
    const scrollToHashElement = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          // Small timeout to ensure DOM is fully loaded
          setTimeout(() => {
            // Calculate position to center the element vertically
            const elementRect = element.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const middleOfElement = absoluteElementTop + elementRect.height / 2;
            const offsetPosition = middleOfElement - (window.innerHeight / 2);
            
            // Scroll with smooth behavior
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    };

    // Scroll on initial load
    scrollToHashElement();

    // Add event listener for hash changes
    window.addEventListener('hashchange', scrollToHashElement);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', scrollToHashElement);
    };
  }, []);
}; 