import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Eye, ArrowLeft, Tag, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from '@/lib/axios';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/blog/${slug}`);
        setPost(response.data);
      } catch (error: any) {
        console.error('Error fetching blog post:', error);
        toast({
          title: 'Error',
          description: error.response?.status === 404 ? 'Blog post not found' : 'Failed to load blog post',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, toast]);

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

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied!',
          description: 'Blog post URL copied to clipboard'
        });
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Blog post URL copied to clipboard'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading blog post...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
              <Link to="/blog">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-8">
          <Link to="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Category Badge */}
            <Badge className={`mb-4 ${getCategoryColor(post.category)}`}>
              {post.category.replace('-', ' ')}
            </Badge>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {post.views} views
              </span>
              <span>By {post.author.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="ml-auto"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-sm rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <span className="font-display font-bold text-xl text-foreground">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{post.author.name}</h3>
                  <p className="text-muted-foreground">Professional Writer & Content Creator</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t text-center">
              <Link to="/blog">
                <Button size="lg">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  More Articles
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;