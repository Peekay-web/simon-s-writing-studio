import { Download, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-14 px-4 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium animate-fade-in">
              Welcome to my portfolio
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Hon. Chukwuemeka PK Samuel Simon
            </h1>
            <p className="text-lg md:text-xl text-primary font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Research Writer • Consultant • Freelancer
            </p>
            <p className="text-base text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Content & Copywriting Expert with a unique writing style, specializing in 
              academic project writing for ND, HND, BSc, PGD, MSc, and PhD degrees.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 hover:shadow-lg" asChild>
                <a href="/contact">
                  Hire Me
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105" asChild>
                <a href="/cv.docx" download="PK_Simon_CV.docx">
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </a>
              </Button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="order-1 lg:order-2 flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative group">
              <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-xl border-4 border-primary/20 bg-secondary transition-transform duration-300 group-hover:scale-[1.02]">
                <img 
                  src="/WhatsApp Image 2026-01-08 at 21.27.25.jpeg" 
                  alt="Hon. Chukwuemeka PK Samuel Simon - Professional Research Writer" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                      fallbackDiv.className = 'fallback-content w-full h-full bg-secondary flex items-center justify-center';
                      fallbackDiv.innerHTML = `
                        <div class="text-center">
                          <div class="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/40">
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
              <div className="absolute -top-3 -right-3 w-16 h-16 sm:w-20 sm:h-20 border-2 border-primary/30 rounded-full transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -bottom-3 -left-3 w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden lg:block animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <a href="#about" className="flex flex-col items-center text-primary hover:text-primary/80 transition-colors duration-200">
            <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
