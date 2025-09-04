import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink, Trash2, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ShortenedUrl } from '../types';
import { Log } from '../lib/logger';

interface UrlResultsTableProps {
  urls: ShortenedUrl[];
  onDeleteUrl?: (id: string) => void;
  showActions?: boolean;
}

export default function UrlResultsTable({ urls, onDeleteUrl, showActions = true }: UrlResultsTableProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getShortUrl = (shortCode: string) => {
    return `${window.location.origin}/short/${shortCode}`;
  };

  const copyToClipboard = async (shortCode: string, id: string) => {
    try {
      const shortUrl = getShortUrl(shortCode);
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      
      toast({
        title: "Copied!",
        description: "URL copied to clipboard",
        variant: "default"
      });
      
      Log('frontend', 'info', 'component', `Copied short URL to clipboard: ${shortCode}`);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive"
      });
      Log('frontend', 'error', 'component', `Failed to copy URL: ${error}`);
    }
  };

  const handleDelete = (id: string) => {
    if (onDeleteUrl) {
      onDeleteUrl(id);
    }
  };

  const isExpired = (url: ShortenedUrl) => {
    return !url.isActive || (url.expiresAt && new Date() > url.expiresAt);
  };

  if (urls.length === 0) {
    return (
      <Card className="shadow-sm" data-testid="empty-results">
        <CardContent className="py-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link2 className="w-8 h-8 text-muted-foreground" />
            <p className="text-muted-foreground">No URLs shortened yet</p>
            <p className="text-xs text-muted-foreground">Create your first shortened URL above</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm" data-testid="url-results-table">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shortened URLs</CardTitle>
          <div className="text-sm text-muted-foreground">
            Session: <span data-testid="session-count">{urls.length} URLs created</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Original URL</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Shortened URL</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Expires</th>
                {showActions && (
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr 
                  key={url.id} 
                  className={`border-b border-border hover:bg-muted/50 ${copiedId === url.id ? 'copy-success' : ''}`}
                  data-testid={`url-row-${url.id}`}
                >
                  <td className="py-3 px-4">
                    <div className="max-w-xs truncate text-sm text-foreground" title={url.originalUrl}>
                      {url.originalUrl}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <a 
                        href={`/short/${url.shortCode}`}
                        className="text-sm text-primary hover:text-primary/80 font-mono"
                        data-testid={`link-short-${url.shortCode}`}
                      >
                        quicklink.app/{url.shortCode}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(url.shortCode, url.id)}
                        className="p-1 h-auto text-muted-foreground hover:text-foreground"
                        title="Copy to clipboard"
                        data-testid={`button-copy-${url.shortCode}`}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-muted-foreground hover:text-foreground"
                        title="Open original URL"
                        data-testid={`button-open-${url.shortCode}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span 
                      className={`text-sm ${
                        isExpired(url) 
                          ? 'text-destructive' 
                          : url.expiresAt 
                          ? 'text-muted-foreground' 
                          : 'text-secondary'
                      }`}
                      data-testid={`expiry-${url.shortCode}`}
                    >
                      {formatDate(url.expiresAt)}
                    </span>
                  </td>
                  {showActions && (
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(url.id)}
                        className="text-xs text-destructive hover:text-destructive/80 p-1 h-auto"
                        data-testid={`button-delete-${url.shortCode}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
