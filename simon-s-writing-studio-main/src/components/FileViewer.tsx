import React, { useState, useEffect } from 'react';
import { Loader2, FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FileViewerProps {
  portfolioId: string;
  fileName: string;
  fileType?: string;
}

interface ConvertedFile {
  fileType: string;
  originalName: string;
  data: any;
}

const FileViewer: React.FC<FileViewerProps> = ({ portfolioId, fileName, fileType }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileData, setFileData] = useState<ConvertedFile | null>(null);

  useEffect(() => {
    loadFile();
  }, [portfolioId]);

  const loadFile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/portfolio/${portfolioId}/view`);
      
      if (!response.ok) {
        throw new Error('Failed to load file');
      }

      const contentType = response.headers.get('content-type');
      
      // Handle PDF files
      if (contentType?.includes('application/pdf')) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setFileData({
          fileType: 'pdf',
          originalName: fileName,
          data: { url }
        });
      } else {
        // Handle converted Office files
        const data = await response.json();
        setFileData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  const renderWordDocument = (data: any) => (
    <div className="prose max-w-none p-6 bg-white rounded-lg border">
      <div dangerouslySetInnerHTML={{ __html: data.html }} />
    </div>
  );

  const renderExcelDocument = (data: any) => (
    <div className="space-y-4">
      <Tabs defaultValue={data.sheetNames[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-auto">
          {data.sheetNames.map((sheetName: string) => (
            <TabsTrigger key={sheetName} value={sheetName}>
              {sheetName}
            </TabsTrigger>
          ))}
        </TabsList>
        {data.sheetNames.map((sheetName: string) => (
          <TabsContent key={sheetName} value={sheetName}>
            <Card>
              <CardHeader>
                <CardTitle>{sheetName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <tbody>
                      {data.sheets[sheetName].map((row: any[], rowIndex: number) => (
                        <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-50 font-semibold' : ''}>
                          {row.map((cell: any, cellIndex: number) => (
                            <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                              {cell || ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  const renderPowerPointDocument = (data: any) => (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground mb-4">
        PowerPoint Slides ({data.length} slides)
      </div>
      <div className="grid gap-4">
        {data.map((slide: string, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">Slide {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={slide} 
                alt={`Slide ${index + 1}`}
                className="w-full h-auto rounded-lg border"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPdfDocument = (data: any) => (
    <div className="w-full h-screen">
      <iframe
        src={data.url}
        className="w-full h-full border rounded-lg"
        title={fileName}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading document...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={loadFile} variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No file data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span className="font-medium">{fileData.originalName}</span>
          <span className="text-sm text-muted-foreground">
            ({fileData.fileType.toUpperCase()})
          </span>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {fileData.fileType === 'word' && renderWordDocument(fileData.data)}
        {fileData.fileType === 'excel' && renderExcelDocument(fileData.data)}
        {fileData.fileType === 'powerpoint' && renderPowerPointDocument(fileData.data)}
        {fileData.fileType === 'pdf' && renderPdfDocument(fileData.data)}
      </div>
    </div>
  );
};

export default FileViewer;