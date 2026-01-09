import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  return (
    <section id="blog" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Insights & Articles
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Blog
          </h2>
          <div className="w-16 h-[2px] bg-foreground mx-auto mb-8" />
          <p className="text-muted-foreground">
            Sharing knowledge and insights from my experience in professional writing
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {blogPosts.map((post, index) => (
            <Card 
              key={index} 
              className="group hover:border-foreground/50 transition-colors duration-300"
            >
              {/* Blog Image Placeholder */}
              <div className="h-48 bg-muted flex items-center justify-center border-b border-border">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-lg bg-secondary flex items-center justify-center mb-2">
                    <span className="font-display text-2xl font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Featured Image</p>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="uppercase tracking-wider">{post.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                </div>
                <CardTitle className="font-display text-lg leading-tight group-hover:text-muted-foreground transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                  {post.excerpt}
                </CardDescription>
                <Button variant="link" className="p-0 h-auto font-medium">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
