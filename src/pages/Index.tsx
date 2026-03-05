import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { PreSalesService } from '@/components/PreSalesService';
import { RideMowerHire } from '@/components/RideMowerHire';
import { Pricing } from '@/components/Pricing';
import { BookingSection } from '@/components/BookingSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Testimonials } from '@/components/Testimonials';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { VoiceAIOrb } from '@/components/VoiceAIOrb';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <PreSalesService />
        <RideMowerHire />
        <Pricing />
        <BookingSection />
        <WhyChooseUs />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <VoiceAIOrb />
    </div>
  );
};

export default Index;
