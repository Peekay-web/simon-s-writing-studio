import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Eye, 
  TrendingUp,
  Users,
  Calendar,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';

interface DashboardStats {
  totalPortfolios: number;
  publishedPortfolios: number;
  pendingTestimonials: number;
  totalTestimonials: number;
  recentViews: number;
  recentPortfolioViews: number;
}

interface RecentTestimonial {
  _id: string;
  name: string;
  rating: number;
  review: string;
  projectType: string;
  createdAt: string;
}

interface TopPortfolio {
  _id: string;
  title: string;
  views: number;
  category: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTestimonials, setRecentTestimonials] = useState<RecentTestimonial[]>([]);
  const [topPortfolios, setTopPortfolios] = useState<TopPortfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      const data = response.data;
      
      setStats(data.stats);
      setRecentTestimonials(data.latestTestimonials || []);
      setTopPortfolios(data.topPortfolios || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, description, icon: Icon, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-500">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your writing studio.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Portfolio Items"
            value={stats?.totalPortfolios || 0}
            description={`${stats?.publishedPortfolios || 0} published`}
            icon={FileText}
          />
          <StatCard
            title="Testimonials"
            value={stats?.totalTestimonials || 0}
            description={`${stats?.pendingTestimonials || 0} pending approval`}
            icon={MessageSquare}
          />
          <StatCard
            title="Recent Views"
            value={stats?.recentViews || 0}
            description="Last 7 days"
            icon={Eye}
            trend="+12% from last week"
          />
          <StatCard
            title="Portfolio Views"
            value={stats?.recentPortfolioViews || 0}
            description="Last 7 days"
            icon={Users}
            trend="+8% from last week"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Testimonials */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Testimonials</CardTitle>
              <CardDescription>
                Recent testimonials waiting for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTestimonials.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No pending testimonials
                  </p>
                ) : (
                  recentTestimonials.map((testimonial) => (
                    <div key={testimonial._id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{testimonial.name}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < testimonial.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {testimonial.review.substring(0, 100)}...
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {testimonial.projectType}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(testimonial.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Portfolio Items */}
          <Card>
            <CardHeader>
              <CardTitle>Most Viewed Portfolio</CardTitle>
              <CardDescription>
                Your most popular portfolio items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPortfolios.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No portfolio items yet
                  </p>
                ) : (
                  topPortfolios.map((portfolio, index) => (
                    <div key={portfolio._id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {portfolio.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {portfolio.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {portfolio.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Add Portfolio Item</h3>
                <p className="text-sm text-muted-foreground">Upload a new project to showcase</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Review Testimonials</h3>
                <p className="text-sm text-muted-foreground">Approve or reject pending reviews</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Check your website performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;