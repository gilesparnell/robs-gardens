import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Pricing } from '@/components/Pricing';
import { Availability } from '@/components/Availability';
import { Testimonials } from '@/components/Testimonials';
import { WhyChooseUs } from '@/components/WhyChooseUs';
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
        <Pricing />
        <Availability />
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
