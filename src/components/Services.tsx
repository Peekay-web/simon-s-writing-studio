import { Pen, Search, FileEdit, MessageSquare, Lightbulb, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Search,
    title: "Research Writing",
    description: "Comprehensive research papers with thorough literature reviews, methodology development, and data analysis.",
  },
  {
    icon: GraduationCap,
    title: "Academic Project Writing",
    description: "Expert assistance in designing and writing projects for ND, HND, BSc, PGD, MSc, and PhD degrees.",
  },
  {
    icon: Pen,
    title: "Content Writing",
    description: "Engaging and SEO-optimized content for websites, blogs, articles, and digital platforms.",
  },
  {
    icon: FileEdit,
    title: "Copywriting",
    description: "Persuasive copy for marketing materials, advertisements, and landing pages that converts.",
  },
  {
    icon: Lightbulb,
    title: "Consulting Services",
    description: "Professional guidance on research methodology, academic writing standards, and project development.",
  },
  {
    icon: MessageSquare,
    title: "Editing & Proofreading",
    description: "Meticulous review of documents to ensure clarity, coherence, and error-free content.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-3">
            What I Offer
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Services
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Professional writing services tailored to meet your academic and business needs
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <Card 
              key={service.title} 
              className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full cursor-default"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary transition-all duration-300">
                  <service.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <CardTitle className="font-display text-lg group-hover:text-primary transition-colors duration-200">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed text-sm">
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
