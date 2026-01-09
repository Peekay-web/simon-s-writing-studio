import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    quote: "Hon. Chukwuemeka delivered exceptional work on my PhD thesis. His attention to detail and understanding of academic requirements is outstanding.",
    name: "Dr. Amara Okonkwo",
    title: "PhD Graduate, University of Lagos",
  },
  {
    quote: "Working with him was a game-changer for my business. The content he created significantly improved our online presence and customer engagement.",
    name: "Michael Adekunle",
    title: "CEO, TechStart Nigeria",
  },
  {
    quote: "His research skills are impeccable. He helped me navigate complex methodology and delivered my MSc project ahead of schedule.",
    name: "Blessing Nwachukwu",
    title: "MSc Graduate, Covenant University",
  },
  {
    quote: "Professional, reliable, and incredibly talented. I've worked with many writers, but Hon. Chukwuemeka stands out for his unique writing style.",
    name: "David Obi",
    title: "Marketing Director, GlobalBrands",
  },
];

const Testimonials = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="testimonials" className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div 
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-10 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-3">
            Client Feedback
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Testimonials
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            What my clients say about working with me
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className={`relative group hover:border-primary/40 hover:shadow-md transition-all duration-500 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6 pb-5">
                <Quote className="w-8 h-8 text-primary/20 absolute top-5 left-5 group-hover:text-primary/40 transition-colors duration-300" />
                <p className="text-muted-foreground leading-relaxed mb-5 pl-6 text-sm">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3 pl-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <span className="font-display font-semibold text-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
