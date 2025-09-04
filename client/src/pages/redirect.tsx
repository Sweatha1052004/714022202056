import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { getUrlByShortCode } from '../lib/storage';
import { ShortenedUrl } from '../types';
import { Log } from '../lib/logger';

export default function Redirect() {
  const [match, params] = useRoute('/short/:shortCode');
  const [url, setUrl] = useState<ShortenedUrl | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!match || !params?.shortCode) return;

    const fetchUrl = async () => {
      try {
        Log('frontend', 'info', 'page', `Attempting to redirect shortcode: ${params.shortCode}`);
        
        // First check localStorage
        const localUrl = getUrlByShortCode(params.shortCode);
        if (localUrl) {
          // Check if expired
          if (!localUrl.isActive || (localUrl.expiresAt && new Date() > localUrl.expiresAt)) {
            setError('This URL has expired');
            Log('frontend', 'warn', 'page', `Attempted to access expired URL: ${params.shortCode}`);
            setLoading(false);
            return;
          }

          setUrl(localUrl);
          setLoading(false);
          
          // Start countdown
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                Log('frontend', 'info', 'page', `Redirecting to: ${localUrl.originalUrl}`);
                window.location.href = localUrl.originalUrl;
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
        } else {
          // Try server API
          try {
            const response = await fetch(`/api/url/${params.shortCode}`);
            if (response.ok) {
              const serverUrl = await response.json();
              setUrl(serverUrl);
              setLoading(false);
              
              // Start countdown for server URL
              const timer = setInterval(() => {
                setCountdown(prev => {
                  if (prev <= 1) {
                    clearInterval(timer);
                    Log('frontend', 'info', 'page', `Redirecting to: ${serverUrl.originalUrl}`);
                    window.location.href = serverUrl.originalUrl;
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);

              return () => clearInterval(timer);
            } else if (response.status === 404) {
              setError('URL not found');
              Log('frontend', 'error', 'page', `URL not found: ${params.shortCode}`);
            } else if (response.status === 410) {
              setError('This URL has expired');
              Log('frontend', 'warn', 'page', `Attempted to access expired URL: ${params.shortCode}`);
            } else {
              setError('Failed to load URL');
              Log('frontend', 'error', 'page', `Failed to load URL: ${response.status}`);
            }
          } catch (fetchError) {
            setError('URL not found');
            Log('frontend', 'error', 'page', `Error fetching URL: ${fetchError}`);
          }
        }
      } catch (err) {
        setError('Something went wrong');
        Log('frontend', 'error', 'page', `Redirect error: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, [match, params]);

  const handleContinue = () => {
    if (url) {
      Log('frontend', 'info', 'page', `Manual redirect to: ${url.originalUrl}`);
      window.location.href = url.originalUrl;
    }
  };

  const handleCancel = () => {
    Log('frontend', 'info', 'page', 'User cancelled redirect');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" data-testid="redirect-loading">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" data-testid="redirect-error">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Oops!</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={handleCancel} className="w-full">
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" data-testid="redirect-page">
      <div className="max-w-md w-full mx-auto px-4">
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Redirecting...</h2>
              <p className="text-muted-foreground">
                Taking you to your destination
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Short URL</p>
                <p className="text-sm font-mono text-foreground" data-testid="redirect-short-url">
                  quicklink.app/{params?.shortCode}
                </p>
              </div>
              
              {url && (
                <div className="p-4 bg-muted/50 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Destination</p>
                  <p className="text-sm text-foreground truncate" data-testid="redirect-destination">
                    {url.originalUrl}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="flex-1"
                data-testid="button-cancel-redirect"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleContinue}
                className="flex-1"
                data-testid="button-continue-redirect"
              >
                Continue
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              Redirecting automatically in <span data-testid="countdown-timer">{countdown}</span> seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
