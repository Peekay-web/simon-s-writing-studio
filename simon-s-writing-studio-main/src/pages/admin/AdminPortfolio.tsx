import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const AdminPortfolio = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600">Manage your portfolio items, upload files, and organize your work.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Portfolio Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Portfolio Management Coming Soon</h3>
              <p className="text-muted-foreground">
                Upload Word, Excel, PowerPoint, and PDF files to showcase your work.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;