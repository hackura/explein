import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import DemoPreview from '../components/landing/DemoPreview';
import Benefits from '../components/landing/Benefits';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-blue-200">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <DemoPreview />
        <Benefits />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
