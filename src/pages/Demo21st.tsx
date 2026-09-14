import Hero21st from '../components/ui-21st/Hero21st';
import LookbookCarousel21st from '../components/ui-21st/LookbookCarousel21st';
import TestimonialWall21st from '../components/ui-21st/TestimonialWall21st';
import BookingCTA21st from '../components/ui-21st/BookingCTA21st';
import Footer21st from '../components/ui-21st/Footer21st';

export default function Demo21st() {
  return (
    <main className="bg-ivory min-h-screen">
      <Hero21st />
      <LookbookCarousel21st />
      <TestimonialWall21st />
      <BookingCTA21st />
      <Footer21st />
    </main>
  );
}