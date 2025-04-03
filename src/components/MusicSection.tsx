import React from "react";

// Single song data with real album art
const song = { 
  title: "SIX MILE", 
  coverArt: "/optimized-images/aeb65232-8cfa-4d07-8b7a-f8ff111d49cc.png" 
};

const MusicSection = () => {
  return (
    <section id="music" className="py-16 bg-tan">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-maroon font-bold text-center mb-10">MUSIC</h2>
        
        <div className="flex flex-col justify-center items-center">
          <div className="text-center">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 mx-auto mb-4 overflow-hidden">
              <img 
                src={song.coverArt} 
                alt={song.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl text-maroon font-medium mb-4">{song.title}</h3>
            <a 
              href="https://ffm.to/sixmile" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-maroon text-white uppercase px-6 sm:px-8 py-2 rounded tracking-wider text-sm sm:text-base hover:bg-maroon/90 transition-colors"
            >
              Listen Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
