import { FileText, Award, Users, BookOpen } from "lucide-react";

const skills = [
  "Microsoft Word",
  "Microsoft Excel",
  "Microsoft PowerPoint",
  "Google Spreadsheet",
  "Research Writing",
  "Academic Writing",
  "Content Writing",
  "Copywriting",
];

const stats = [
  { icon: FileText, value: "500+", label: "Projects Completed" },
  { icon: Users, value: "300+", label: "Happy Clients" },
  { icon: Award, value: "10+", label: "Years Experience" },
  { icon: BookOpen, value: "6", label: "Degree Levels" },
];

const About = () => {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">
            About Me
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Crafting Words That Make a Difference
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto mb-8" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* About Text */}
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              I am <span className="text-primary font-semibold">Hon. Chukwuemeka Samuel PK Simon</span>, 
              a dedicated Research Writer, Consultant, and Freelancer with a passion for helping 
              individuals and organizations achieve their academic and professional goals through 
              the power of well-crafted words.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              With extensive experience in content writing and copywriting, I bring a unique writing 
              style that combines clarity, precision, and engagement. I am proficient in Microsoft 
              Office Suite including Word, PowerPoint, Excel, and Spreadsheet applications.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              My expertise spans across assisting students in research and project design for various 
              academic degrees including <span className="text-primary font-semibold">ND, HND, BSc, PGD, MSc, and PhD</span>. 
              I take pride in delivering high-quality work that meets international standards and 
              helps my clients succeed in their academic pursuits.
            </p>

            {/* Skills */}
            <div className="pt-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                Core Competencies
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 sm:px-4 py-2 bg-background border border-primary/20 text-sm text-foreground rounded-full hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-background border border-border hover:border-primary/30 p-4 sm:p-6 text-center rounded-lg hover:shadow-md transition-all duration-300 group"
              >
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4 text-primary group-hover:scale-110 transition-transform" />
                <p className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
