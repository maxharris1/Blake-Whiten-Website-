import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useState } from "react";

// Updated videos data with YouTube IDs and titles
const videos = [
  { 
    id: 1, 
    title: "Rollin' Stone (Live Session)", 
    youtubeId: "y3j2OCN0oOQ"
  },
  { 
    id: 2, 
    title: "He's Gone (Live Session)", 
    youtubeId: "wjAtNLBYkyg"
  },
  { 
    id: 3, 
    title: "Breakin' My Heart (Live Session)", 
    youtubeId: "iMt6iCGtgnI"
  },
];

const VideosSection = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const nextVideo = () => {
    setIsPlaying(false);
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };
  
  const prevVideo = () => {
    setIsPlaying(false);
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };
  
  const currentVideo = videos[currentVideoIndex];

  // Function to get high-quality thumbnail URL from YouTube ID
  const getYouTubeThumbnail = (youtubeId) => {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  };
  
  return (
    <section id="videos" className="py-16 bg-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-[#e1c9a1] font-bold text-center mb-8">VIDEOS</h2>
        
        <div className="relative max-w-2xl mx-auto">
          {/* Back to Videos button when playing */}
          <div className="text-[#e1c9a1] text-sm mb-2 flex justify-end">
            {isPlaying && (
              <button 
                onClick={() => setIsPlaying(false)} 
                className="underline hover:opacity-80"
              >
                Back to Videos
              </button>
            )}
          </div>
          
          {/* Video container with centered navigation arrows */}
          <div className="relative">
            <div className="relative aspect-video rounded overflow-hidden">
              {isPlaying ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1`}
                  title={currentVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                ></iframe>
              ) : (
                <>
                  <img 
                    src={getYouTubeThumbnail(currentVideo.youtubeId)} 
                    alt={currentVideo.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <button 
                      onClick={() => setIsPlaying(true)} 
                      className="bg-[#e1c9a1] rounded-full p-4 opacity-90 hover:opacity-100 transition transform hover:scale-105"
                    >
                      <Play size={32} className="text-black ml-1" />
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Repositioned navigation arrows */}
            <button 
              onClick={prevVideo} 
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-12 text-[#e1c9a1] z-10 bg-black/40 rounded-full p-2 ${isPlaying ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <ArrowLeft size={24} />
            </button>
            
            <button 
              onClick={nextVideo} 
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-12 text-[#e1c9a1] z-10 bg-black/40 rounded-full p-2 ${isPlaying ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <ArrowRight size={24} />
            </button>
          </div>
          
          <h3 className="text-xl text-[#e1c9a1] font-medium text-center mt-6">
            {currentVideo.title}
          </h3>

          {/* Video thumbnail previews */}
          <div className={`grid grid-cols-3 gap-4 mt-6 ${isPlaying ? 'opacity-0 pointer-events-none' : ''}`}>
            {videos.map((video, index) => (
              <div 
                key={video.id}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentVideoIndex(index);
                }}
                className={`relative cursor-pointer transition transform hover:scale-105 ${
                  index === currentVideoIndex ? 'ring-2 ring-[#e1c9a1]' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img 
                  src={getYouTubeThumbnail(video.youtubeId)} 
                  alt={video.title}
                  className="w-full h-auto aspect-video object-cover rounded" 
                />
                {index === currentVideoIndex && (
                  <div className="absolute top-0 right-0 bg-[#e1c9a1] text-black px-2 py-1 text-xs font-bold">
                    CURRENT
                  </div>
                )}
                <p className="text-[#e1c9a1] text-xs mt-1 truncate text-center">
                  {video.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
