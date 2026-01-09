import { Linkedin, Twitter, Facebook, Instagram } from "lucide-react";

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const quickLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-foreground to-foreground/90 text-background py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-4 text-primary-foreground">
              Hon. Chukwuemeka Samuel Simon
            </h3>
            <p className="text-background/70 leading-relaxed mb-6 text-sm sm:text-base">
              Professional Research Writer, Consultant, and Freelancer dedicated to 
              helping you achieve your academic and professional goals.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-background/30 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-base sm:text-lg font-semibold mb-4 text-primary-foreground">Contact Info</h4>
            <ul className="space-y-2 sm:space-y-3 text-background/70 text-sm sm:text-base">
              <li>
                <a 
                  href="mailto:chukwuemekasimon@yahoo.com" 
                  className="hover:text-primary transition-colors break-all"
                >
                  chukwuemekasimon@yahoo.com
                </a>
              </li>
              <li>
                <a href="tel:+2348082453150" className="hover:text-primary transition-colors">
                  +234 808 245 3150
                </a>
              </li>
              <li>Nigeria</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-background/20 pt-6 sm:pt-8 text-center">
          <p className="text-background/60 text-xs sm:text-sm">
            © {currentYear} Hon. Chukwuemeka Samuel Simon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
