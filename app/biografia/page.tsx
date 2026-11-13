import { Heart, Music, Globe, Award } from "lucide-react";
import Image from "next/image";

const milestones = [
  {
    year: "Infância",
    title: "O Chamado",
    description:
      "Desde muito jovem, Nair descobriu sua paixão pela música nos cultos da igreja local em Angola.",
  },
  {
    year: "2015",
    title: "Primeiros Passos",
    description:
      "Início da carreira musical com participações em eventos gospel e gravação das primeiras músicas.",
  },
  {
    year: "2018",
    title: "Reconhecimento",
    description:
      "Lançamento do primeiro álbum que alcançou milhares de ouvintes em Angola e países lusófonos.",
  },
  {
    year: "2020",
    title: "Expansão Internacional",
    description:
      "O ministério ultrapassa fronteiras com apresentações no Brasil, Portugal e outros países.",
  },
  {
    year: "Hoje",
    title: "Missão Contínua",
    description:
      "Continua levando a mensagem de esperança e fé através da música, tocando vidas pelo mundo.",
  },
];

const highlights = [
  { icon: Heart, value: "6+", label: "Anos de Ministério" },
  { icon: Music, value: "20+", label: "Músicas Lançadas" },
  { icon: Globe, value: "5+", label: "Países Visitados" },
  { icon: Award, value: "1M+", label: "Vidas Impactadas" },
];

const fotos = [
  {
    id: 1,
    image: "/imagens/foto1.jpg",
    alt: "Foto da Nair 1",
  },
  {
    id: 2,
    image: "/imagens/foto2.jpg",
    alt: "Foto da Nair 2",
  },
  {
    id: 3,
    image: "/imagens/foto3.jpg",
    alt: "Foto da Nair 3",
  },
  {
    id: 4,
    image: "/imagens/foto4.jpg",
    alt: "Foto da Nair 4",
  },
];

const Biography = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-navy h-7 overflow-hidden">
        
        <div className="pt-4 pb-14 bg-primary-foreground text-center">
          <p className="text-navy font-medium text-xl mx-auto w-[90%] md:w-[80%]">
            Uma jornada de fé, superação e dedicação ao ministério
          </p>
        </div>
      </section>

      {/* Main Bio Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto w-[80%] md:w-[90%] px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <div className="relative">
              <div className="aspect-4/5 rounded-2xl overflow-hidden shadow-celestial">
                <Image
                  src="/imagens/nair1.webp"
                  alt="Nair Nany"
                  width={400} // largura fixa
                  height={400} // altura fixa
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative frame */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-gold rounded-2xl z-10 pointer-events-none" />
            </div>

            {/* Bio Text */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy">
                Quem é{" "}
                <span className="text-primary-foreground">Nair Nany</span> ?
              </h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Nair Nany é uma talentosa cantora gospel angolana que tem
                  dedicado a sua vida a proclamar o amor de Deus através da
                  música. Nascida e criada em Angola, descobriu o seu chamado
                  musical ainda na infância, cantando nos corais das igrejas
                  locais.
                </p>

                <p>
                  Com uma voz poderosa e ungida, Nair tem a capacidade única de
                  tocar os corações mais endurecidos e trazer cura através das
                  suas canções. O seu estilo combina elementos tradicionais
                  africanos com sonoridades contemporâneas, criando uma música
                  autêntica e impactante.
                </p>

                <p>
                  Ao longo dos anos, o seu ministério expandiu-se para além das
                  fronteiras angolanas, levando-a a apresentar-se no Brasil,
                  Portugal e outros países lusófonos. Cada apresentação é mais
                  do que um concerto — é um momento de adoração e encontro com
                  Deus.
                </p>

                <p className="text-gold font-medium italic">
                  "A minha missão é simples: usar o dom que Deus me deu para
                  glorificá-Lo e para levar esperança a todos que precisam ouvir
                  uma palavra de amor."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-navy">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-15 md:gap-8">
            {highlights.map((item) => (
              <div key={item.label} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-2 md:mb-4">
                  <item.icon className="h-8 w-8 text-gold" />
                </div>
                <p className="text-3xl md:text-4xl font-serif font-bold text-gold mb-2">
                  {item.value}
                </p>
                <p className="text-primary-foreground/70 text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
              A Minha Jornada
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Os momentos que marcaram a minha caminhada no ministério
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative pl-8 pb-12 last:pb-0">
                {/* Timeline line */}
                {index !== milestones.length - 1 && (
                  <div className="absolute left-2.75 top-6 bottom-0 w-0.5 bg-gold/30" />
                )}

                {/* Timeline dot */}
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gold border-4 border-background" />

                {/* Content */}
                <div className="bg-cream rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-gold font-semibold text-sm">
                    {milestone.year}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-navy mt-1 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Placeholder */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
              Galeria
            </h2>
            <p className="text-muted-foreground">
              Momentos especiais do ministério
            </p>
          </div>

          <div className="grid grid-cols md:grid-cols-4 gap-4">
            {fotos.map((item) => (
              <div
                key={item.id}
                className="aspect-square rounded-xl overflow-hidden shadow-md"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Biography;
