import { useState, useEffect } from 'react';
import Navigation from '../components/navigation';
import UrlShortenerForm from '../components/url-shortener-form';
import UrlResultsTable from '../components/url-results-table';
import { useUrls } from '../hooks/use-urls';
import { useToast } from '@/hooks/use-toast';
import { Log } from '../lib/logger';

export default function Home() {
  const { urls, isLoading, shortenUrls, deleteUrl, error } = useUrls();
  const { toast } = useToast();

  useEffect(() => {
    Log('frontend', 'info', 'page', 'URL Shortener page loaded');
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleShortenUrls = (urlInputs: any[]) => {
    Log('frontend', 'info', 'page', `User submitted ${urlInputs.length} URLs for shortening`);
    shortenUrls(urlInputs);
  };

  const handleDeleteUrl = (id: string) => {
    Log('frontend', 'info', 'page', `User deleted URL with id: ${id}`);
    deleteUrl(id);
  };

  return (
    <div className="min-h-screen bg-background" data-testid="home-page">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Simplify Your Links</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform long URLs into short, manageable links. Create up to 5 URLs at once with custom codes and expiry times.
          </p>
        </div>
        
        {/* URL Shortener Form */}
        <div className="mb-6">
          <UrlShortenerForm 
            onSubmit={handleShortenUrls} 
            isLoading={isLoading}
          />
        </div>
        
        {/* Results Section */}
        <UrlResultsTable 
          urls={urls}
          onDeleteUrl={handleDeleteUrl}
          showActions={true}
        />
      </main>
    </div>
  );
}
