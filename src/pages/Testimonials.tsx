import { useState, useEffect } from 'react';
import { Star, Quote, Plus, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from '@/lib/axios';

interface Testimonial {
  _id: string;
  name: string;
  status: string;
  career: string;
  rating: number;
  statement: string;
  projectType: string;
  createdAt: string;
}

interface TestimonialStats {
  averageRating: number;
  totalReviews: number;
  distribution: { [key: number]: number };
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<TestimonialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: '',
    career: '',
    rating: 5,
    statement: '',
    projectType: ''
  });

  const fetchTestimonials = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/testimonials?page=${page}&limit=6`);
      setTestimonials(response.data.testimonials);
      setStats(response.data.stats);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: 'Error',
        description: 'Failed to load testimonials',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post('/api/testimonials', formData);
      toast({
        title: 'Success!',
        description: 'Thank you for your testimonial! It has been added to our reviews.'
      });
      setIsDialogOpen(false);
      setFormData({
        name: '',
        email: '',
        status: '',
        career: '',
        rating: 5,
        statement: '',
        projectType: ''
      });
      fetchTestimonials(currentPage); // Refresh testimonials
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit testimonial',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
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
                Client Feedback
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Testimonials
              </h1>
              <div className="w-16 h-[2px] bg-foreground mx-auto mb-8" />
              <p className="text-lg text-muted-foreground mb-8">
                Real feedback from clients who have experienced our writing services
              </p>

              {/* Stats Display */}
              {stats && (
                <div className="flex flex-wrap justify-center gap-8 mb-12">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {renderStars(Math.round(stats.averageRating))}
                      <span className="text-2xl font-bold">{stats.averageRating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {stats.totalReviews}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                  </div>
                </div>
              )}

              {/* Add Testimonial Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Add Your Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share Your Experience</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="status">Status/Title</Label>
                      <Input
                        id="status"
                        placeholder="e.g., Student, Professional, CEO"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="career">Career/Field</Label>
                      <Input
                        id="career"
                        placeholder="e.g., Engineering, Medicine, Business"
                        value={formData.career}
                        onChange={(e) => setFormData({ ...formData, career: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label>Rating</Label>
                      {renderStars(formData.rating, true, (rating) => 
                        setFormData({ ...formData, rating })
                      )}
                    </div>

                    <div>
                      <Label htmlFor="projectType">Project Type</Label>
                      <Select 
                        value={formData.projectType} 
                        onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="research">Research</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="content">Content Writing</SelectItem>
                          <SelectItem value="copywriting">Copywriting</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="editing">Editing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="statement">Your Testimonial</Label>
                      <Textarea
                        id="statement"
                        placeholder="Share your experience working with us..."
                        value={formData.statement}
                        onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full gap-2" disabled={submitting}>
                      <Send className="w-4 h-4" />
                      {submitting ? 'Submitting...' : 'Submit Testimonial'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading testimonials...</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial._id} className="relative">
                      <CardContent className="pt-8 pb-6">
                        <Quote className="w-8 h-8 text-muted-foreground/30 absolute top-6 left-6" />
                        
                        <div className="pl-8 mb-4">
                          {renderStars(testimonial.rating)}
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed mb-6 pl-8">
                          "{testimonial.statement}"
                        </p>
                        
                        <div className="flex items-center gap-4 pl-8">
                          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                            <span className="font-display font-semibold text-foreground">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.status}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.career}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pl-8">
                          <span className="inline-block px-2 py-1 bg-secondary text-xs rounded-full capitalize">
                            {testimonial.projectType}
                          </span>
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
                      onClick={() => fetchTestimonials(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 py-2 text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => fetchTestimonials(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      View More
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

export default Testimonials;