import { useCallback, useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const scrollToSection = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Update URL hash
      window.history.replaceState(null, "", `#${elementId}`);
      
      // Get navbar height to use as offset
      const navbar = document.querySelector('nav');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      
      // Calculate position accounting for the navbar height
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const offsetPosition = absoluteElementTop - navbarHeight;
      
      // Scroll with smooth behavior
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      setIsMenuOpen(false); // Close menu after navigation
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-4 md:px-8 py-2 z-20 md:bg-transparent bg-black/80 backdrop-blur-sm md:backdrop-blur-none">
      <div className="flex items-center">
        <button 
          onClick={scrollToTop}
          className="focus:outline-none hover:opacity-90 transition cursor-pointer"
        >
          <img 
            src="/optimized-images/6703af04-7193-4c7b-9be2-15205aa596a9.png" 
            alt="Blake Whiten Logo" 
            className="h-24 sm:h-28 md:h-32 lg:h-40" 
          />
        </button>
      </div>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 text-[#DDAE76] text-sm uppercase tracking-widest">
        <button 
          onClick={() => scrollToSection("music")} 
          className="hover:opacity-80 transition cursor-pointer"
        >
          MUSIC
        </button>
        <button 
          onClick={() => scrollToSection("videos")} 
          className="hover:opacity-80 transition cursor-pointer"
        >
          VIDEOS
        </button>
        <button 
          onClick={() => scrollToSection("tour")} 
          className="hover:opacity-80 transition cursor-pointer"
        >
          TOUR
        </button>
      </div>
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-[#DDAE76] p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm md:hidden flex flex-col items-center py-4 space-y-4 text-[#DDAE76] text-sm uppercase tracking-widest">
          <button 
            onClick={() => scrollToSection("music")} 
            className="hover:opacity-80 transition cursor-pointer w-full text-center py-2"
          >
            MUSIC
          </button>
          <button 
            onClick={() => scrollToSection("videos")} 
            className="hover:opacity-80 transition cursor-pointer w-full text-center py-2"
          >
            VIDEOS
          </button>
          <button 
            onClick={() => scrollToSection("tour")} 
            className="hover:opacity-80 transition cursor-pointer w-full text-center py-2"
          >
            TOUR
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
