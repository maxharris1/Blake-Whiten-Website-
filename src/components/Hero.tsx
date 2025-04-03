const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden pt-16 sm:pt-24 md:pt-32">
      <div className="absolute inset-0">
        <img 
          src="/optimized-images/hero-optimized.jpg" 
          alt="Blake Whiten" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};

export default Hero;
