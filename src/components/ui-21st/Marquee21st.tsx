export default function Marquee21st() {
  const items = ['Bridal', 'Evening', 'Rental', 'Alterations', 'Gallery'];

  return (
    <section className="bg-onyx py-8 overflow-hidden" aria-label="Marquee">
      <div className="marquee-track flex gap-12 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="font-label text-xs tracking-[0.35em] uppercase text-gold">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}