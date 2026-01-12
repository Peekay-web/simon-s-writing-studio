import { useState, useEffect } from "react";
import { Eye, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import axios, { API_BASE_URL } from "@/lib/axios";
import FileViewer from "./FileViewer";

interface PortfolioItem {
  id: string | number;
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
  const { ref: filterRef, isVisible: filterVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.05 });

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
      const params = new URLSearchParams({ limit: '12' });
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      const response = await axios.get(`/api/portfolio?${params}`);
      setPortfolios(response.data.portfolios || []);
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

  return (
    <section id="portfolio" className="py-12 sm:py-16 lg:py-20 bg-secondary/30 min-h-[400px]">
      <div className="container mx-auto px-4 sm:px-6">
        <div
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-10 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
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
          className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-700 delay-100 ${filterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          {categories.map((category, index) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="px-6 rounded-full transition-all duration-300"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" />
            <span className="text-muted-foreground font-medium">Loading projects...</span>
          </div>
        ) : (
          <div ref={gridRef}>
            {portfolios.length === 0 ? (
              <div className="text-center py-20 bg-background/50 rounded-2xl border-2 border-dashed">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground font-medium">No projects found in this category.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {portfolios.map((project, index) => (
                  <Card
                    key={project.id}
                    className={`group overflow-hidden border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 bg-card backdrop-blur-sm ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                      }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Project Thumbnail */}
                    <div className="h-56 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border-b border-border relative overflow-hidden">
                      {project.customThumbnail || project.thumbnail ? (
                        <img
                          src={(project.customThumbnail || project.thumbnail)?.startsWith('http')
                            ? (project.customThumbnail || project.thumbnail)
                            : `${API_BASE_URL}/${project.customThumbnail || project.thumbnail}`}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="text-center p-6">
                          <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-3 border-2 border-primary/30">
                            <FileText className="h-10 w-10 text-primary" />
                          </div>
                          <p className="text-xs text-primary font-bold uppercase tracking-wider">Document Preview</p>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className={`${getCategoryColor(project.category)} border-none px-3 py-1`}>
                          {project.category}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-4">
                      <CardTitle className="font-display text-xl group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </CardTitle>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{project.views} views</span>
                        </div>
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <CardDescription className="text-muted-foreground leading-relaxed mb-6 text-sm line-clamp-3">
                        {project.description}
                      </CardDescription>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[10px] font-medium tracking-wider uppercase bg-secondary/50">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="secondary" className="text-[10px] bg-secondary/50">
                              +{project.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 rounded-lg"
                            onClick={() => setSelectedPortfolio(project)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="font-display text-2xl">
                              {selectedPortfolio?.title}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-6 space-y-6">
                            {selectedPortfolio?.hasFile ? (
                              <div className="space-y-4">
                                <h4 className="font-semibold text-lg border-b pb-2">Document Preview</h4>
                                <FileViewer
                                  portfolioId={selectedPortfolio.id}
                                  title={selectedPortfolio.title}
                                />
                              </div>
                            ) : (
                              (selectedPortfolio?.customThumbnail || selectedPortfolio?.thumbnail) && (
                                <img
                                  src={(selectedPortfolio.customThumbnail || selectedPortfolio.thumbnail)?.startsWith('http')
                                    ? (selectedPortfolio.customThumbnail || selectedPortfolio.thumbnail)
                                    : `${API_BASE_URL}/${selectedPortfolio.customThumbnail || selectedPortfolio.thumbnail}`}
                                  alt={selectedPortfolio.title}
                                  className="w-full rounded-xl shadow-lg"
                                />
                              )
                            )}

                            <div className="grid md:grid-cols-3 gap-8">
                              <div className="md:col-span-2 space-y-4">
                                <h4 className="font-semibold text-lg">Project Description</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {selectedPortfolio?.description}
                                </p>
                              </div>
                              <div className="space-y-6">
                                <div>
                                  <h4 className="font-semibold mb-3">Category</h4>
                                  <Badge className={getCategoryColor(selectedPortfolio?.category || '')}>
                                    {selectedPortfolio?.category}
                                  </Badge>
                                </div>
                                {selectedPortfolio?.tags && selectedPortfolio.tags.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-3">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedPortfolio.tags.map((tag, idx) => (
                                        <Badge key={idx} variant="secondary">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
