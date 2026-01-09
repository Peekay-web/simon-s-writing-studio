import { Download, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-4 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">
              Welcome to my portfolio
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Hon. Chukwuemeka Samuel Simon
            </h1>
            <p className="text-lg md:text-xl text-primary font-medium mb-4">
              Research Writer • Consultant • Freelancer
            </p>
            <p className="text-base text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Content & Copywriting Expert with a unique writing style, specializing in 
              academic project writing for ND, HND, BSc, PGD, MSc, and PhD degrees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <a href="#contact">
                  Hire Me
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white" asChild>
                <a href="/cv.pdf" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </a>
              </Button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl border-4 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
                <img 
                  src="/WhatsApp Image 2026-01-08 at 21.27.25.jpeg" 
                  alt="Hon. Chukwuemeka Samuel Simon - Professional Research Writer" 
                  className="w-full h-full object-cover"
                  onLoad={() => {
                    console.log('Profile image loaded successfully');
                  }}
                  onError={(e) => {
                    console.log('Image failed, using professional fallback');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback-content')) {
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = 'fallback-content w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center';
                      fallbackDiv.innerHTML = `
                        <div class="text-center">
                          <div class="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-primary/30 flex items-center justify-center border-2 border-primary/40">
                            <span class="text-2xl sm:text-3xl font-display text-primary font-bold">CES</span>
                          </div>
                          <p class="text-xs sm:text-sm text-primary font-medium">Professional Writer</p>
                        </div>
                      `;
                      parent.appendChild(fallbackDiv);
                    }
                  }}
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 border-2 border-primary/30 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
          <a href="#about" className="flex flex-col items-center text-primary hover:text-primary/80 transition-colors">
            <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
