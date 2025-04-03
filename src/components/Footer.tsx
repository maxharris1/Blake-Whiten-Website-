import { Instagram, Youtube } from "lucide-react";
import { FaSpotify } from "react-icons/fa";
import { SiAmazonmusic, SiApplemusic } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="py-6 bg-tan text-maroon text-xs text-center border-t border-maroon/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-6 mb-6">
          <a href="https://www.tiktok.com/@blakewhiten1" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" fill="currentColor" />
            </svg>
          </a>
          <a href="https://www.youtube.com/channel/UCVXtiVxxYZ6U0Zc9xCnJaRA" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
            <Youtube className="h-6 w-6" />
          </a>
          <a href="https://www.instagram.com/blakewhiten/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="https://open.spotify.com/artist/1BjlNhp6EsDG0UMroeJbRM" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
            <FaSpotify className="h-6 w-6" />
          </a>
          <a href="https://music.amazon.com/artists/B0DC8KY8XH/blake-whiten" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
            <SiAmazonmusic className="h-6 w-6" />
          </a>
          <a href="https://music.apple.com/us/artist/blake-whiten/1761470610" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
            <SiApplemusic className="h-6 w-6" />
          </a>
        </div>
        
        <p>
          © 2025 BLAKE WHITEN | ENCHNTMNT. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
