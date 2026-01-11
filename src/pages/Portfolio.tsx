import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PortfolioSection from "@/components/Portfolio";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-14">
        <PortfolioSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Portfolio;
