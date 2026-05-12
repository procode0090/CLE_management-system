

const Craftsmanship = () => {
  return (
    <section className="py-24 px-8 md:px-16 lg:px-24 grid md:grid-cols-2 gap-16 lg:gap-24 items-center bg-white">
      {/* Image Column */}
      <div className="flex justify-center items-center w-full">
        <div className="relative h-[500px] md:h-[600px] w-full max-w-md overflow-hidden rounded-[2rem] shadow-2xl shadow-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7" 
            className="h-full w-full object-cover  transition-all duration-[1.5s] ease-in-out transform hover:scale-105"
            alt="Watch Craftsmanship"
          />
          {/* Subtle overlay for a premium feel */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </div>
      </div>

      {/* Text Column */}
      <div className="space-y-8 max-w-lg">
        <div className="space-y-4">
          <span className="text-[#D4AF37] font-extrabold uppercase text-[10px] tracking-[0.5em] block">
            The Art of Horology
          </span>
          <h2 className="text-5xl lg:text-6xl font-serif text-gray-900 leading-[1.1] tracking-tight">
            Hand-Assembled <br/> 
            <span className="italic">Excellence.</span>
          </h2>
        </div>
        
        <div className="w-12 h-[1px] bg-[#D4AF37]" /> {/* Decorative Gold Divider */}

        <p className="text-gray-500 leading-relaxed text-lg font-light">
          Every CLE timepiece undergoes 200 hours of rigorous testing. 
          Our master watchmakers ensure that every gear, every spring, 
          and every diamond is set with mathematical perfection.
        </p>

        {/* <button className="pt-4 text-xs uppercase tracking-[0.3em] font-bold border-b border-gray-900 pb-2 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
          Discover the Process
        </button> */}
      </div>
    </section>
  );
};

export default Craftsmanship;