import { Card, CardContent } from '@/components/ui/card';
import { Link, MousePointer, Clock } from 'lucide-react';
import { ShortenedUrl } from '../types';

interface StatisticsCardsProps {
  urls: ShortenedUrl[];
}

export default function StatisticsCards({ urls }: StatisticsCardsProps) {
  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);
  const activeUrls = urls.filter(url => {
    const now = new Date();
    return url.isActive && (!url.expiresAt || now < url.expiresAt);
  }).length;

  const cards = [
    {
      title: 'Total URLs',
      value: totalUrls,
      icon: Link,
      color: 'bg-primary/10 text-primary',
      testId: 'stat-total-urls'
    },
    {
      title: 'Total Clicks',
      value: totalClicks,
      icon: MousePointer,
      color: 'bg-secondary/10 text-secondary',
      testId: 'stat-total-clicks'
    },
    {
      title: 'Active URLs',
      value: activeUrls,
      icon: Clock,
      color: 'bg-accent/10 text-accent-foreground',
      testId: 'stat-active-urls'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="shadow-sm" data-testid={card.testId}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-md ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold text-foreground" data-testid={`${card.testId}-value`}>
                  {card.value.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
