import HeroSection from '@/components/hero/HeroSection';
import KeyMetrics from '@/components/sections/KeyMetrics';
import CausesSection from '@/components/sections/CausesSection';
import ImpactsSection from '@/components/sections/ImpactsSection';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <KeyMetrics />
      <CausesSection />
      <ImpactsSection />
      <Footer />
    </main>
  );
}