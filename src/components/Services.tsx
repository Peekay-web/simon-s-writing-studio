import { Pen, Search, FileEdit, MessageSquare, Lightbulb, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Search,
    title: "Research Writing",
    description: "Comprehensive research papers with thorough literature reviews, methodology development, and data analysis for academic and professional purposes.",
  },
  {
    icon: GraduationCap,
    title: "Academic Project Writing",
    description: "Expert assistance in designing and writing projects for ND, HND, BSc, PGD, MSc, and PhD degrees across various academic fields.",
  },
  {
    icon: Pen,
    title: "Content Writing",
    description: "Engaging and SEO-optimized content for websites, blogs, articles, and digital platforms that captivate your audience.",
  },
  {
    icon: FileEdit,
    title: "Copywriting",
    description: "Persuasive copy for marketing materials, advertisements, landing pages, and sales content that converts readers into customers.",
  },
  {
    icon: Lightbulb,
    title: "Consulting Services",
    description: "Professional guidance on research methodology, academic writing standards, and project development strategies.",
  },
  {
    icon: MessageSquare,
    title: "Editing & Proofreading",
    description: "Meticulous review of your documents to ensure clarity, coherence, and error-free content that meets professional standards.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-16 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">
            What I Offer
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Services
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto mb-8" />
          <p className="text-muted-foreground text-base sm:text-lg">
            Professional writing services tailored to meet your academic and business needs
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service) => (
            <Card 
              key={service.title} 
              className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full"
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <service.icon className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <CardTitle className="font-display text-lg sm:text-xl group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
