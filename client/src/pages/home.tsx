import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card as CardType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Printer, Upload, Trash2, GripVertical } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [isPrintMode, setIsPrintMode] = useState(false);
  const { toast } = useToast();

  const { data: cards = [], isLoading } = useQuery<CardType[]>({
    queryKey: ["/api/cards"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
      return apiRequest("POST", "/api/cards/upload", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Cards uploaded successfully",
        description: "Your images have been converted to cards",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cards/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Card deleted",
        description: "The card has been removed",
      });
    },
  });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        uploadMutation.mutate(e.target.files);
      }
    },
    [uploadMutation]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadMutation.mutate(e.dataTransfer.files);
      }
    },
    [uploadMutation]
  );

  const totalPages = Math.ceil(cards.length / 9);
  const filledCards = [...cards];
  while (filledCards.length % 9 !== 0 && filledCards.length > 0) {
    filledCards.push({
      id: `empty-${filledCards.length}`,
      imageUrl: "",
      type: "empty",
      position: filledCards.length.toString(),
      createdAt: new Date(),
    } as CardType);
  }

  const pages = [];
  for (let i = 0; i < filledCards.length; i += 9) {
    pages.push(filledCards.slice(i, i + 9));
  }

  if (isPrintMode) {
    return (
      <div className="print-view">
        <style>{`
          @page {
            size: letter;
            margin: 0;
          }

          @media print {
            body {
              background: white;
              margin: 0;
              padding: 0;
            }

            .print-controls {
              display: none !important;
            }

            .print-page {
              width: 215.9mm;
              height: 279.4mm;
              background: white;
              page-break-after: always;
              position: relative;
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .print-page:last-child {
              page-break-after: auto;
            }

            .print-grid {
              display: grid;
              grid-template-columns: repeat(3, 63mm);
              grid-template-rows: repeat(3, 88mm);
              gap: 0;
              width: 189mm;
              height: 264mm;
            }

            .print-card {
              width: 63mm;
              height: 88mm;
              border: 1px solid #ddd;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
            }

            .print-card img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
              display: block;
            }
          }

          @media screen {
            .print-page {
              width: 215.9mm;
              height: 279.4mm;
              background: white;
              margin: 20px auto;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .print-grid {
              display: grid;
              grid-template-columns: repeat(3, 63mm);
              grid-template-rows: repeat(3, 88mm);
              gap: 0;
              width: 189mm;
              height: 264mm;
            }

            .print-card {
              width: 63mm;
              height: 88mm;
              border: 1px solid #ddd;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
            }

            .print-card img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
              display: block;
            }
          }
        `}</style>

        <div className="print-controls fixed top-0 left-0 right-0 bg-background border-b p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsPrintMode(false)}
              variant="outline"
              data-testid="button-exit-print"
            >
              Exit Print Preview
            </Button>
            <span className="text-sm text-muted-foreground">
              {totalPages} {totalPages === 1 ? "page" : "pages"} • {cards.length} {cards.length === 1 ? "card" : "cards"}
            </span>
          </div>
          <Button
            onClick={() => window.print()}
            data-testid="button-print"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>

        <div className="pt-20 pb-8 bg-muted">
          {pages.map((pageCards, pageIndex) => (
            <div key={pageIndex} className="print-page">
              <div className="print-grid">
                {pageCards.map((card, cardIndex) => (
                  <div key={card.id} className="print-card" data-testid={`print-card-${pageIndex}-${cardIndex}`}>
                    {card.imageUrl && <img src={card.imageUrl} alt={`Card ${cardIndex + 1}`} />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Card Printer</h1>
            <p className="text-sm text-muted-foreground">
              {cards.length} {cards.length === 1 ? "card" : "cards"} • {totalPages} {totalPages === 1 ? "page" : "pages"}
            </p>
          </div>
          <Button
            onClick={() => setIsPrintMode(true)}
            disabled={cards.length === 0}
            data-testid="button-preview-print"
          >
            <Printer className="w-4 h-4 mr-2" />
            Preview Print Layout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border rounded-lg p-12 mb-8 text-center bg-card hover-elevate transition-colors"
          data-testid="upload-zone"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Upload PNG or Image Files</h2>
          <p className="text-muted-foreground mb-4">
            Drag and drop your images here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Each image will be formatted as a 63mm × 88mm card (Magic: The Gathering size)
          </p>
          <label htmlFor="file-upload">
            <Button asChild data-testid="button-upload">
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
            data-testid="input-file"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="aspect-[63/88] animate-pulse bg-muted" />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
              <Upload className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No cards yet</h3>
            <p className="text-muted-foreground">
              Upload images to get started with your card collection
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4">Card Preview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  className="aspect-[63/88] relative group overflow-hidden hover-elevate"
                  data-testid={`card-${card.id}`}
                >
                  <img
                    src={card.imageUrl}
                    alt={card.originalFileName || "Card"}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(card.id)}
                      data-testid={`button-delete-${card.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {card.originalFileName && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                      {card.originalFileName}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
