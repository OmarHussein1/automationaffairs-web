import { useTranslation } from "react-i18next";

export function TestimonialsSection() {
  const { t } = useTranslation();

  const clients = [
    {
      name: "Deep",
      logo: "/testimonials/deep_black.png",
      scale: 1,
      url: "https://www.deepmeasures.health",
    },
    {
      name: "Ourtales",
      logo: "/testimonials/ourtales_black.png",
      scale: 2,
      url: "https://ourtales.com",
    },
    {
      name: "SAM",
      logo: "/testimonials/sam_black.png",
      scale: 1.5,
      url: "https://www.sam-kuchler.com",
    },
  ];

  return (
    <div className="h-full flex flex-col justify-center bg-[#3b5bdb] dark:bg-[#f3ff5a]">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <div className="testimonials-header text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white dark:text-black">
            {t("home:testimonials.title")}
          </h2>
        </div>

        {/* Logos Grid */}
        <div className="testimonials-grid flex flex-wrap justify-center items-center gap-12 lg:gap-16">
          {clients.map((client, index) => (
            <a
              key={index}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="testimonial-card flex items-center justify-center"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="w-auto object-contain grayscale invert dark:invert-0 hover:scale-110 transition-all duration-300"
                style={{
                  maxHeight: `${client.scale * 64}px`,
                }}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
