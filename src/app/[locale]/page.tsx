import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { HowItWorks } from "@/components/HowItWorks";
import { Location } from "@/components/Location";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <HowItWorks />
      <Location />
      <Contact />
      <Footer />
    </main>
  );
}
