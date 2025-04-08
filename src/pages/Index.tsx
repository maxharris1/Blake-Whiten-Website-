import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MusicSection from "../components/MusicSection";
import VideosSection from "../components/VideosSection";
import TourSection from "../components/TourSection";
import MerchSection from "../components/MerchSection";
import Footer from "../components/Footer";
import { useHashScroll } from "../hooks/useHashScroll";

const Index = () => {
  // Use the hook to handle hash-based scrolling
  useHashScroll();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <MusicSection />
      <VideosSection />
      <TourSection />
      <MerchSection />
      <Footer />
    </div>
  );
};

export default Index;
