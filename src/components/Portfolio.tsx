import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "PhD Dissertation",
    category: "Academic Research",
    description: "Comprehensive doctoral research on sustainable development practices in emerging economies.",
  },
  {
    title: "MSc Thesis Project",
    category: "Academic Research",
    description: "Master's thesis exploring the impact of digital transformation on organizational performance.",
  },
  {
    title: "Corporate Report",
    category: "Business Writing",
    description: "Annual sustainability report for a multinational corporation with data visualization.",
  },
  {
    title: "Website Content",
    category: "Content Writing",
    description: "Full website copywriting for a tech startup, including landing pages and product descriptions.",
  },
  {
    title: "Marketing Campaign",
    category: "Copywriting",
    description: "Complete marketing copy for a product launch campaign across multiple channels.",
  },
  {
    title: "Research Publication",
    category: "Academic Research",
    description: "Peer-reviewed journal article on educational technology and learning outcomes.",
  },
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
            My Work
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Portfolio
          </h2>
          <div className="w-16 h-[2px] bg-foreground mx-auto mb-8" />
          <p className="text-muted-foreground">
            A selection of projects showcasing my expertise across different writing disciplines
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden hover:border-foreground/50 transition-colors duration-300"
            >
              {/* Project Image Placeholder */}
              <div className="h-48 bg-muted flex items-center justify-center border-b border-border">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-2">
                    <span className="font-display text-lg font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Project Image</p>
                </div>
              </div>
              <CardHeader>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {project.category}
                </p>
                <CardTitle className="font-display text-lg">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </CardDescription>
                <Button variant="outline" size="sm" className="group-hover:bg-foreground group-hover:text-background transition-colors">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
