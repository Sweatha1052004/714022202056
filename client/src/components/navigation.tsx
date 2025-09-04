import { Link, useLocation } from 'wouter';
import { Link2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-card border-b border-border navbar-shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3" data-testid="brand-logo">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-foreground">QuickLink</h1>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-4">
            <Link href="/">
              <Button
                variant={location === '/' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-2"
                data-testid="nav-shortener"
              >
                <Link2 className="w-4 h-4" />
                <span>Shortener</span>
              </Button>
            </Link>
            <Link href="/statistics">
              <Button
                variant={location === '/statistics' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-2"
                data-testid="nav-statistics"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Statistics</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
