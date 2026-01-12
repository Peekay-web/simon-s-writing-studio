import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileSpreadsheet,
  Layout,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios, { API_BASE_URL } from '@/lib/axios';

interface FileViewerProps {
  portfolioId: string | number;
  title: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ portfolioId, title }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, skipSnaps: false });

  useEffect(() => {
    const fetchViewData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/portfolio/${portfolioId}/view`);
        setViewData(response.data);
      } catch (err: any) {
        console.error('Failed to load preview:', err);
        setError(err.response?.data?.message || 'Failed to load file preview. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchViewData();
  }, [portfolioId]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentPage(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-secondary/10 rounded-xl border border-dashed animate-pulse">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Preparing your preview...</p>
        <p className="text-xs text-muted-foreground mt-2 italic">Larger documents may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-destructive/5 rounded-xl border border-destructive/20">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-destructive font-semibold">Preview Unavailable</p>
        <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">{error}</p>
        <Button
          variant="outline"
          className="mt-6 border-destructive/20 hover:bg-destructive/10"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!viewData) return null;

  // Multi-page Image Viewer (PDF/PPT)
  if (Array.isArray(viewData.data) && (viewData.fileType === 'pdf' || viewData.fileType === 'powerpoint')) {
    const images = viewData.data;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="px-3 py-1 bg-primary/5 border-primary/20 text-primary">
            {viewData.fileType.toUpperCase()} - {images.length} Pages
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Page {currentPage + 1} of {images.length}
            </span>
          </div>
        </div>

        <div className="relative group">
          <div className="overflow-hidden bg-black/5 rounded-xl" ref={emblaRef}>
            <div className="flex">
              {images.map((imgUrl: string, idx: number) => (
                <div key={idx} className="flex-[0_0_100%] min-w-0 flex justify-center p-4">
                  <img
                    src={`${API_BASE_URL}/${imgUrl}`}
                    alt={`Page ${idx + 1}`}
                    className="max-w-full h-auto shadow-2xl rounded-sm object-contain max-h-[70vh]"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>

          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm shadow-xl hover:scale-110 active:scale-95"
                onClick={scrollPrev}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm shadow-xl hover:scale-110 active:scale-95"
                onClick={scrollNext}
                disabled={currentPage === images.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        {/* Thumbnails / Navigation Dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 flex-wrap pt-2">
            {images.slice(0, 10).map((_: any, idx: number) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentPage ? 'bg-primary w-6' : 'bg-primary/20 hover:bg-primary/40'
                  }`}
                onClick={() => emblaApi?.scrollTo(idx)}
              />
            ))}
            {images.length > 10 && <span className="text-[10px] text-muted-foreground">...</span>}
          </div>
        )}
      </div>
    );
  }

  // Native PDF View Fallback (If conversion fails / system lacks Poppler)
  if (viewData.fileType === 'pdf-raw') {
    // Check if URL is already a full URL (Cloudinary) or relative path
    const pdfUrl = viewData.url.startsWith('http') ? viewData.url : `${API_BASE_URL}${viewData.url}`;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="px-3 py-1 bg-amber-500/5 border-amber-500/20 text-amber-600">
            PDF VIEWER (NATIVE)
          </Badge>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center font-medium"
          >
            Open in new tab
          </a>
        </div>
        <div className="rounded-xl overflow-hidden border bg-muted shadow-inner h-[70vh]">
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            className="w-full h-full border-none"
            title={title}
          />
        </div>
      </div>
    );
  }

  // Word Document (HTML)
  if (viewData.fileType === 'word') {
    return (
      <div className="space-y-4">
        <Badge variant="outline" className="px-3 py-1 bg-blue-500/5 border-blue-500/20 text-blue-600">
          WORD DOCUMENT
        </Badge>
        <ScrollArea className="h-[60vh] rounded-xl border bg-white p-8 sm:p-12 shadow-inner">
          <div
            className="prose prose-sm md:prose-base max-w-none prose-headings:font-display prose-headings:text-primary"
            dangerouslySetInnerHTML={{ __html: viewData.data.html }}
          />
        </ScrollArea>
      </div>
    );
  }

  // Excel Spreadsheet
  if (viewData.fileType === 'excel') {
    const sheets = viewData.data.sheets;
    const sheetNames = viewData.data.sheetNames;
    const [activeSheet, setActiveSheet] = useState(sheetNames[0]);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="px-3 py-1 bg-green-500/5 border-green-500/20 text-green-600">
            EXCEL SPREADSHEET
          </Badge>
          {sheetNames.length > 1 && (
            <div className="flex gap-1">
              {sheetNames.map((name: string) => (
                <Button
                  key={name}
                  variant={activeSheet === name ? "default" : "outline"}
                  size="sm"
                  className="text-[10px] h-7 px-3 py-0 rounded-full"
                  onClick={() => setActiveSheet(name)}
                >
                  {name}
                </Button>
              ))}
            </div>
          )}
        </div>
        <ScrollArea className="h-[60vh] rounded-xl border bg-secondary/5 shadow-inner">
          <div className="p-4">
            <div className="overflow-x-auto min-w-full inline-block align-middle">
              <table className="min-w-full border-collapse">
                <tbody>
                  {sheets[activeSheet].map((row: any[], rIdx: number) => (
                    <tr key={rIdx} className={rIdx === 0 ? "bg-secondary/40 font-bold" : "border-b border-border hover:bg-secondary/20 transition-colors"}>
                      {row.map((cell: any, cIdx: number) => (
                        <td key={cIdx} className="px-4 py-3 text-xs border-r border-border whitespace-nowrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-secondary/10 rounded-xl border border-dashed">
      <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
      <p className="text-muted-foreground font-medium mb-4">No rich preview available for this file type.</p>
      <Button asChild variant="outline">
        <a href={`${API_BASE_URL}/api/portfolio/${portfolioId}/file`} target="_blank" rel="noopener noreferrer">
          View or Download Original File
        </a>
      </Button>
    </div>
  );
};

export default FileViewer;