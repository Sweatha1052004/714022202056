import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Navigation from '../components/navigation';
import StatisticsCards from '../components/statistics-cards';
import StatisticsTable from '../components/statistics-table';
import { useUrls } from '../hooks/use-urls';
import { Download, Trash2 } from 'lucide-react';
import { Log } from '../lib/logger';

export default function Statistics() {
  const { urls, deleteUrl, clearAll } = useUrls();

  useEffect(() => {
    Log('frontend', 'info', 'page', 'Statistics page loaded');
  }, []);

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(urls, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `tinylink-urls-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      Log('frontend', 'info', 'utils', `Exported ${urls.length} URLs to JSON file`);
    } catch (error) {
      Log('frontend', 'error', 'utils', `Failed to export data: ${error}`);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all URLs? This action cannot be undone.')) {
      clearAll();
      Log('frontend', 'info', 'page', 'User cleared all URLs from statistics page');
    }
  };

  return (
    <div className="min-h-screen bg-background" data-testid="statistics-page">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">URL Statistics</h2>
            <p className="text-muted-foreground">
              Track your shortened URLs and their performance
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="flex items-center space-x-2"
              data-testid="button-export-data"
              disabled={urls.length === 0}
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="flex items-center space-x-2 text-destructive border-destructive hover:bg-destructive/10"
              data-testid="button-clear-all-stats"
              disabled={urls.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </Button>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="mb-8">
          <StatisticsCards urls={urls} />
        </div>
        
        {/* Detailed Statistics Table */}
        <StatisticsTable 
          urls={urls}
          onDeleteUrl={deleteUrl}
        />
      </main>
    </div>
  );
}
