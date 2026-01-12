import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, FileText, Upload, X, Loader2, Paperclip, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import axios, { API_BASE_URL } from '@/lib/axios';

interface PortfolioItem {
  id: string | number; // Changed from _id to id to match Sequelize
  title: string;
  description: string;
  category: string;
  tags: string[];
  file?: {
    originalName: string;
    filename: string;
    mimetype: string;
    size: number;
  };
  customThumbnail?: string;
  views: number;
  isPublished: boolean;
  createdAt: string;
}

const AdminPortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    isPublished: true
  });

  const categories = [
    { value: 'research', label: 'Research' },
    { value: 'academic', label: 'Academic' },
    { value: 'content', label: 'Content Writing' },
    { value: 'copywriting', label: 'Copywriting' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'editing', label: 'Editing' }
  ];

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/portfolio?category=all&limit=100'); // Fetch all for admin
      setItems(response.data.portfolios || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load portfolio items',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      tags: '',
      isPublished: true
    });
    setEditingItem(null);
    setSelectedFile(null);
    setSelectedThumbnail(null);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      isPublished: item.isPublished
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);

      // Convert tags string to array
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      data.append('tags', JSON.stringify(tagsArray));

      data.append('isPublished', String(formData.isPublished));

      if (selectedFile) {
        data.append('file', selectedFile);
      }

      if (selectedThumbnail) {
        data.append('thumbnail', selectedThumbnail);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingItem) {
        await axios.put(`/api/portfolio/${editingItem.id}`, data, config);
        toast({
          title: 'Success!',
          description: 'Portfolio item updated successfully'
        });
      } else {
        await axios.post('/api/portfolio', data, config);
        toast({
          title: 'Success!',
          description: 'Portfolio item created successfully'
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save portfolio item',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this item? This cannot be undone.')) return;

    try {
      await axios.delete(`/api/portfolio/${id}`);
      toast({
        title: 'Success!',
        description: 'Portfolio item deleted successfully'
      });
      fetchItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete item',
        variant: 'destructive'
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'research': 'bg-blue-100 text-blue-800',
      'academic': 'bg-green-100 text-green-800',
      'content': 'bg-purple-100 text-purple-800',
      'copywriting': 'bg-orange-100 text-orange-800',
      'consulting': 'bg-indigo-100 text-indigo-800',
      'editing': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
            <p className="text-gray-600">Showcase your work to potential clients</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Academic Research Paper on Economics"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
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
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="research, writing, analysis"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      placeholder="Describe the project, your role, and the outcome..."
                      required
                    />
                  </div>

                  {/* File Upload Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Project File (PDF, Doc, etc.)</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors text-center cursor-pointer relative">
                        <input
                          type="file"
                          id="file-upload"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        />
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {selectedFile ? selectedFile.name : (editingItem?.file?.originalName || "Upload File")}
                          </span>
                          <span className="text-xs text-gray-400">
                            Max 50MB
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Thumbnail (Optional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors text-center cursor-pointer relative">
                        <input
                          type="file"
                          id="thumbnail-upload"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
                          accept="image/*"
                        />
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <ImageIcon className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {selectedThumbnail ? selectedThumbnail.name : (editingItem?.customThumbnail ? "Change Image" : "Upload Image")}
                          </span>
                          <span className="text-xs text-gray-400">
                            JPG, PNG
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                    />
                    <Label htmlFor="isPublished">Publish immediately</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingItem ? 'Update Item' : 'Create Item'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Portfolio List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-primary/10 mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No portfolio items yet</h3>
              <p className="text-gray-500 mb-4 max-w-sm">
                Upload your first project to showcase your work to potential clients.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-200">
                <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center border-b">
                  {item.customThumbnail ? (
                    <img
                      src={`${API_BASE_URL}/${item.customThumbnail}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="h-16 w-16 text-gray-300" />
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </div>
                  {!item.isPublished && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Draft
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold line-clamp-1" title={item.title}>
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {item.views}
                    </span>
                    {item.file && (
                      <span className="flex items-center" title={`${item.file.originalName} (${Math.round(item.file.size / 1024)}KB)`}>
                        <Paperclip className="w-3 h-3 mr-1" />
                        File attached
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-primary hover:text-white transition-colors"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;