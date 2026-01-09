import { useState, useEffect } from "react";
import { ExternalLink, Eye, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import FileViewer from "./FileViewer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  customThumbnail?: string;
  views: number;
  hasFile: boolean;
  createdAt: string;
}

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: filterRef, isVisible: filterVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'research', label: 'Research' },
    { value: 'academic', label: 'Academic' },
    { value: 'content', label: 'Content Writing' },
    { value: 'copywriting', label: 'Copywriting' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'editing', label: 'Editing' }
  ];

  useEffect(() => {
    fetchPortfolios();
  }, [selectedCategory]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/portfolio?category=${selectedCategory}&limit=12`);
      const data = await response.json();
      setPortfolios(data.portfolios || []);
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      research: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      academic: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      content: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      copywriting: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      consulting: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      editing: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  if (loading) {
    return (
      <section id="portfolio" className="py-12 sm:py-16 lg:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading portfolio...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-12 sm:py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div 
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-10 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-3">
            My Work
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Portfolio
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            A selection of projects showcasing my expertise across different writing disciplines
          </p>
        </div>

        {/* Category Filter */}
        <div 
          ref={filterRef}
          className={`flex flex-wrap justify-center gap-2 mb-6 transition-all duration-700 delay-100 ${
            filterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {categories.map((category, index) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="text-xs sm:text-sm transition-all duration-200 hover:scale-105"
              style={{ transitionDelay: `${index * 30}ms` }}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {portfolios.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No projects found in this category.</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {portfolios.map((project, index) => (
              <Card 
                key={project._id} 
                className={`group overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-500 ${
                  gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Project Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border-b border-border relative overflow-hidden">
                  {project.customThumbnail || project.thumbnail ? (
                    <img 
                      src={project.customThumbnail || project.thumbnail} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-2 border-2 border-primary/30">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-xs text-primary font-medium">Document Preview</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={getCategoryColor(project.category)}>
                      {project.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-lg group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.views} views</span>
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4 text-sm">
                    {project.description}
                  </CardDescription>
                  
                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={() => setSelectedPortfolio(project)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="font-display text-xl">
                          {selectedPortfolio?.title}
                        </DialogTitle>
                      </DialogHeader>
                      {selectedPortfolio && selectedPortfolio.hasFile && (
                        <FileViewer 
                          portfolioId={selectedPortfolio._id}
                          fileName={selectedPortfolio.title}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
