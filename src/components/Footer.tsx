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
    <footer className="bg-foreground text-background py-10 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold mb-3 text-primary-foreground">
              Hon. Chukwuemeka PK Samuel Simon
            </h3>
            <p className="text-background/70 leading-relaxed mb-4 text-sm">
              Professional Research Writer, Consultant, and Freelancer dedicated to 
              helping you achieve your academic and professional goals.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-background/30 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-base font-semibold mb-3 text-primary-foreground">Contact Info</h4>
            <ul className="space-y-2 text-background/70 text-sm">
              <li>
                <a 
                  href="mailto:chukwuemekasimon@yahoo.com" 
                  className="hover:text-primary transition-colors duration-200 break-all"
                >
                  chukwuemekasimon@yahoo.com
                </a>
              </li>
              <li>
                <a href="tel:+2348082453150" className="hover:text-primary transition-colors duration-200">
                  +234 808 245 3150
                </a>
              </li>
              <li>Nigeria</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-background/20 pt-6 text-center">
          <p className="text-background/60 text-xs">
            © {currentYear} Hon. Chukwuemeka PK Samuel Simon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;