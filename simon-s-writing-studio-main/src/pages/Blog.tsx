import { useState, useEffect } from 'react';
import { Calendar, Clock, Eye, ArrowRight, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import axios from '@/lib/axios';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  tags: string[];
  category: string;
  publishedAt: string;
  views: number;
  readTime: number;
  author: {
    name: string;
  };
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'writing-tips', label: 'Writing Tips' },
    { value: 'academic', label: 'Academic' },
    { value: 'business', label: 'Business' },
    { value: 'personal', label: 'Personal' },
    { value: 'industry-news', label: 'Industry News' },
    { value: 'tutorials', label: 'Tutorials' }
  ];

  const fetchPosts = async (page = 1, category = 'all') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '6'
      });
      
      if (category && category !== 'all') params.append('category', category);
      
      const response = await axios.get(`/api/blog?${params}`);
      setPosts(response.data.blogs);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog posts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, selectedCategory);
    setCurrentPage(1);
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'writing-tips': 'bg-blue-100 text-blue-800',
      'academic': 'bg-green-100 text-green-800',
      'business': 'bg-purple-100 text-purple-800',
      'personal': 'bg-pink-100 text-pink-800',
      'industry-news': 'bg-orange-100 text-orange-800',
      'tutorials': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Header Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Insights & Stories
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Blog
              </h1>
              <div className="w-16 h-[2px] bg-foreground mx-auto mb-8" />
              <p className="text-lg text-muted-foreground mb-8">
                Thoughts, insights, and stories from the world of professional writing
              </p>

              {/* Category Filter */}
              <div className="max-w-xs mx-auto">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No blog posts found.</p>
                <p className="text-muted-foreground">Check back soon for new content!</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                  {posts.map((post) => (
                    <Card key={post._id} className="group hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-0">
                        {/* Featured Image */}
                        {post.featuredImage ? (
                          <div className="aspect-video overflow-hidden rounded-t-lg">
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-secondary to-muted rounded-t-lg flex items-center justify-center">
                            <div className="text-4xl font-display font-bold text-muted-foreground/30">
                              {post.title.charAt(0)}
                            </div>
                          </div>
                        )}

                        <div className="p-6">
                          {/* Category Badge */}
                          <Badge className={`mb-3 ${getCategoryColor(post.category)}`}>
                            {post.category.replace('-', ' ')}
                          </Badge>

                          {/* Title */}
                          <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            {post.excerpt}
                          </p>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {post.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-xs rounded-full"
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="px-2 py-1 bg-muted text-xs rounded-full">
                                  +{post.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(post.publishedAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.readTime} min read
                              </span>
                            </div>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.views}
                            </span>
                          </div>

                          {/* Read More Button */}
                          <Link to={`/blog/${post.slug}`}>
                            <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              Read More
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => fetchPosts(currentPage - 1, selectedCategory)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 py-2 text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => fetchPosts(currentPage + 1, selectedCategory)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;