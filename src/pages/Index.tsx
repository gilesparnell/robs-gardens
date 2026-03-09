import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { PreSalesService } from '@/components/PreSalesService';
import { RideMowerHire } from '@/components/RideMowerHire';
import { Pricing } from '@/components/Pricing';
import { BookingSection } from '@/components/BookingSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Testimonials } from '@/components/Testimonials';
import { Team } from '@/components/Team';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { GHLChatWidget } from '@/components/GHLChatWidget';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <PreSalesService />
        <Services />
        <RideMowerHire />
        <Pricing />
        <BookingSection />
        <WhyChooseUs />
        <Testimonials />
        <Team />
        <Contact />
      </main>
      <Footer />
      <ErrorBoundary onError={(error, info) => console.error('[GHL Widget Error]', error, info)}>
        <GHLChatWidget />
      </ErrorBoundary>
    </div>
  );
};

export default Index;
