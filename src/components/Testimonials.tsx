import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <section id="testimonials" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Client Feedback
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Testimonials
          </h2>
          <div className="w-16 h-[2px] bg-foreground mx-auto mb-8" />
          <p className="text-muted-foreground">
            What my clients say about working with me
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-8 pb-6">
                <Quote className="w-10 h-10 text-muted-foreground/30 absolute top-6 left-6" />
                <p className="text-muted-foreground leading-relaxed mb-6 pl-8">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4 pl-8">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <span className="font-display font-semibold text-foreground">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
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
