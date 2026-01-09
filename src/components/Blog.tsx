import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const blogPosts = [
  {
    title: "The Art of Academic Writing: A Comprehensive Guide",
    excerpt: "Discover the essential techniques and strategies that can transform your academic writing from average to exceptional.",
    date: "January 5, 2026",
    category: "Academic Writing",
  },
  {
    title: "How to Choose the Right Research Methodology",
    excerpt: "Understanding different research methodologies and selecting the most appropriate one for your study.",
    date: "December 20, 2025",
    category: "Research Tips",
  },
  {
    title: "Content Writing vs Copywriting: Key Differences",
    excerpt: "A detailed comparison of content writing and copywriting, and when to use each approach for maximum impact.",
    date: "December 10, 2025",
    category: "Writing Tips",
  },
];

const Blog = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="blog" className="py-12 sm:py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div 
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-10 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-3">
            Insights & Articles
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Blog
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Sharing knowledge and insights from my experience in professional writing
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {blogPosts.map((post, index) => (
            <Card 
              key={index} 
              className={`group hover:border-primary/50 hover:shadow-lg transition-all duration-500 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Blog Image Placeholder */}
              <div className="h-40 bg-muted flex items-center justify-center border-b border-border overflow-hidden">
                <div className="text-center group-hover:scale-105 transition-transform duration-500">
                  <div className="w-14 h-14 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-2 border border-primary/20">
                    <span className="font-display text-xl font-semibold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Featured Image</p>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="uppercase tracking-wider text-primary">{post.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                </div>
                <CardTitle className="font-display text-base leading-tight group-hover:text-primary transition-colors duration-200">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed mb-3 text-sm">
                  {post.excerpt}
                </CardDescription>
                <Button variant="link" className="p-0 h-auto font-medium text-primary">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
