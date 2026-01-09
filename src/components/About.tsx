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
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-3">
            About Me
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Crafting Words That Make a Difference
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* About Text */}
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              I am <span className="text-primary font-semibold">Hon. Chukwuemeka Samuel PK Simon</span>, 
              a dedicated Research Writer, Consultant, and Freelancer with a passion for helping 
              individuals and organizations achieve their academic and professional goals through 
              the power of well-crafted words.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With extensive experience in content writing and copywriting, I bring a unique writing 
              style that combines clarity, precision, and engagement. I am proficient in Microsoft 
              Office Suite including Word, PowerPoint, Excel, and Spreadsheet applications.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My expertise spans across assisting students in research and project design for various 
              academic degrees including <span className="text-primary font-semibold">ND, HND, BSc, PGD, MSc, and PhD</span>. 
              I take pride in delivering high-quality work that meets international standards.
            </p>

            {/* Skills */}
            <div className="pt-4">
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                Core Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-background border border-primary/20 text-sm text-foreground rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-background border border-border hover:border-primary/40 p-4 sm:p-5 text-center rounded-lg hover:shadow-md transition-all duration-300 group cursor-default"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                <p className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
