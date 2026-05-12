import Hero from "../components/Hero";
import Navbar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import Craftsmanship from "../components/Craftsmanship";
import WhatsAppButton from "../components/WhatsAppButton";
import ServicePillars from "../components/ServicePillars";
import Footer from "../components/Footer";
const MainPage = () => {
  

  return (
    <>
    {/* <VideoIntro /> */}
   
    <main className="selection:bg-[#D4AF37] selection:text-white bg-white">
      <Navbar />
      <Hero />
      <section className="py-20 px-8 max-w-7xl mx-auto">

<ProductCard />
<WhatsAppButton />

      </section>
      <Craftsmanship />
      <ServicePillars />
     
    </main>

     <Footer />
    
     </>
  );
};

export default MainPage; // <--- Ensure this is the very last line