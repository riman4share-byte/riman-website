import RimanHero21st from '../components/demo/RimanHero21st';
import LookbookCarousel21st from '../components/ui-21st/LookbookCarousel21st';
import TestimonialWall21st from '../components/ui-21st/TestimonialWall21st';
import BookingCTA21st from '../components/ui-21st/BookingCTA21st';
import FooterSection from '../components/ui-21st/FooterSection';

export default function Demo21st() {
  return (
    <main className="bg-ivory min-h-screen">
      <RimanHero21st dressCode="RF-BR-2514" />
      <LookbookCarousel21st />
      <TestimonialWall21st />
      <BookingCTA21st />
      <FooterSection />
    </main>
  );
}