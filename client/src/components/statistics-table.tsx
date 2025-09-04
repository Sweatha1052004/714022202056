import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Edit2, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ShortenedUrl } from '../types';
import { Log } from '../lib/logger';

interface StatisticsTableProps {
  urls: ShortenedUrl[];
  onDeleteUrl?: (id: string) => void;
}

export default function StatisticsTable({ urls, onDeleteUrl }: StatisticsTableProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const isExpired = (url: ShortenedUrl) => {
    return !url.isActive || (url.expiresAt && new Date() > url.expiresAt);
  };

  const getStatusBadge = (url: ShortenedUrl) => {
    if (isExpired(url)) {
      return (
        <Badge variant="destructive" className="text-xs">
          Expired
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs">
        Active
      </Badge>
    );
  };

  const filteredUrls = urls.filter(url => {
    const matchesSearch = url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         url.shortCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && !isExpired(url)) ||
                         (statusFilter === 'expired' && isExpired(url));
    
    return matchesSearch && matchesStatus;
  });

  const copyToClipboard = async (shortCode: string) => {
    try {
      const shortUrl = `${window.location.origin}/short/${shortCode}`;
      await navigator.clipboard.writeText(shortUrl);
      
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

  return (
    <Card className="shadow-sm" data-testid="statistics-table">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle>All URLs</CardTitle>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32" data-testid="filter-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search URLs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-48"
                data-testid="search-input"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-2 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Original URL</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Short URL</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Expires</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Clicks</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUrls.map((url) => (
                <tr 
                  key={url.id} 
                  className="border-b border-border hover:bg-muted/50 cursor-pointer"
                  data-testid={`stats-row-${url.id}`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${new URL(url.originalUrl).hostname}`} 
                        alt="Favicon" 
                        className="w-4 h-4"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="max-w-xs truncate text-sm text-foreground" title={url.originalUrl}>
                        {url.originalUrl}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-primary font-mono">
                        quicklink.app/{url.shortCode}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(url.shortCode)}
                        className="p-1 h-auto text-muted-foreground hover:text-foreground"
                        title="Copy to clipboard"
                        data-testid={`button-copy-stats-${url.shortCode}`}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(url.createdAt)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-sm ${isExpired(url) ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {url.expiresAt ? formatDate(url.expiresAt) : 'Never'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-foreground" data-testid={`clicks-${url.shortCode}`}>
                      {url.clickCount}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(url)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                        title="Open URL"
                        data-testid={`button-open-stats-${url.shortCode}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(url.id)}
                        className="p-1 h-auto text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded transition-colors"
                        title="Delete"
                        data-testid={`button-delete-stats-${url.shortCode}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUrls.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <Search className="w-8 h-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No URLs found</p>
                      <p className="text-xs text-muted-foreground">
                        {searchQuery ? 'Try a different search term' : 'Create your first shortened URL'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        {filteredUrls.length > 0 && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUrls.length} of {urls.length} URLs
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
