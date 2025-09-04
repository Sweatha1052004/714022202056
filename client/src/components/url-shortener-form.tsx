import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Link, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UrlInput } from '../types';
import { validateUrlInput } from '../lib/validation';
import { Log } from '../lib/logger';

interface UrlShortenerFormProps {
  onSubmit: (urls: UrlInput[]) => void;
  isLoading: boolean;
}

interface UrlFormData extends UrlInput {
  id: string;
  errors: string[];
}

export default function UrlShortenerForm({ onSubmit, isLoading }: UrlShortenerFormProps) {
  const { toast } = useToast();
  const [urlForms, setUrlForms] = useState<UrlFormData[]>([{
    id: '1',
    originalUrl: '',
    validityMinutes: 30,
    shortCode: '',
    errors: []
  }]);

  const addUrlForm = () => {
    if (urlForms.length < 5) {
      const newForm: UrlFormData = {
        id: Date.now().toString(),
        originalUrl: '',
        validityMinutes: 30,
        shortCode: '',
        errors: []
      };
      setUrlForms(prev => [...prev, newForm]);
      Log('frontend', 'info', 'component', `Added URL form ${urlForms.length + 1}`);
    }
  };

  const removeUrlForm = (id: string) => {
    if (urlForms.length > 1) {
      setUrlForms(prev => prev.filter(form => form.id !== id));
      Log('frontend', 'info', 'component', 'Removed URL form');
    }
  };

  const updateUrlForm = (id: string, field: keyof UrlInput, value: string | number) => {
    setUrlForms(prev => prev.map(form => {
      if (form.id === id) {
        const updated = { ...form, [field]: value, errors: [] };
        return updated;
      }
      return form;
    }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const updatedForms = urlForms.map(form => {
      const validation = validateUrlInput(
        form.originalUrl,
        form.shortCode || undefined,
        form.validityMinutes
      );
      
      if (!validation.isValid) {
        isValid = false;
      }
      
      return { ...form, errors: validation.errors };
    });
    
    setUrlForms(updatedForms);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      Log('frontend', 'error', 'component', 'Form validation failed');
      return;
    }

    const urlsToSubmit = urlForms
      .filter(form => form.originalUrl.trim())
      .map(form => ({
        originalUrl: form.originalUrl.trim(),
        validityMinutes: form.validityMinutes || 30,
        shortCode: form.shortCode || undefined
      }));

    if (urlsToSubmit.length === 0) {
      toast({
        title: "No URLs",
        description: "Please enter at least one URL",
        variant: "destructive"
      });
      return;
    }

    Log('frontend', 'info', 'component', `Submitting ${urlsToSubmit.length} URLs for shortening`);
    onSubmit(urlsToSubmit);
  };

  const clearAll = () => {
    setUrlForms([{
      id: '1',
      originalUrl: '',
      validityMinutes: 30,
      shortCode: '',
      errors: []
    }]);
    Log('frontend', 'info', 'component', 'Cleared all URL forms');
  };

  return (
    <Card className="shadow-sm" data-testid="url-shortener-form">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {urlForms.map((form, index) => (
              <div 
                key={form.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-border rounded-md bg-muted/30"
                data-testid={`url-input-row-${index}`}
              >
                {/* Original URL Input */}
                <div className="md:col-span-6">
                  <Label className="text-sm font-medium text-foreground">
                    URL {index === 0 && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://example.com/very-long-url"
                    value={form.originalUrl}
                    onChange={(e) => updateUrlForm(form.id, 'originalUrl', e.target.value)}
                    className="mt-1"
                    data-testid={`input-url-${index}`}
                  />
                  {form.errors.filter(error => error.includes('URL')).map((error, idx) => (
                    <p key={idx} className="text-xs text-destructive mt-1" data-testid={`error-url-${index}`}>
                      {error}
                    </p>
                  ))}
                </div>
                
                {/* Validity Input */}
                <div className="md:col-span-3">
                  <Label className="text-sm font-medium text-foreground">
                    Validity (minutes)
                  </Label>
                  <Input
                    type="number"
                    placeholder="30"
                    min="1"
                    value={form.validityMinutes || ''}
                    onChange={(e) => updateUrlForm(form.id, 'validityMinutes', parseInt(e.target.value) || 30)}
                    className="mt-1"
                    data-testid={`input-validity-${index}`}
                  />
                  {form.errors.filter(error => error.includes('Validity')).map((error, idx) => (
                    <p key={idx} className="text-xs text-destructive mt-1">
                      {error}
                    </p>
                  ))}
                </div>
                
                {/* Custom Shortcode Input */}
                <div className="md:col-span-3 flex items-end">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-foreground">
                      Custom Code
                    </Label>
                    <div className="flex mt-1">
                      <Input
                        type="text"
                        placeholder="mylink"
                        value={form.shortCode}
                        onChange={(e) => updateUrlForm(form.id, 'shortCode', e.target.value)}
                        pattern="[a-zA-Z0-9]+"
                        data-testid={`input-shortcode-${index}`}
                      />
                      {urlForms.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUrlForm(form.id)}
                          className="ml-2 text-destructive hover:text-destructive"
                          data-testid={`button-remove-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {form.errors.filter(error => error.includes('Short code')).map((error, idx) => (
                      <p key={idx} className="text-xs text-destructive mt-1">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
            <Button
              type="button"
              variant="outline"
              onClick={addUrlForm}
              disabled={urlForms.length >= 5}
              className="flex items-center space-x-2"
              data-testid="button-add-url"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another URL ({5 - urlForms.length} remaining)</span>
            </Button>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={clearAll}
                data-testid="button-clear-all"
              >
                Clear All
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2"
                data-testid="button-shorten-urls"
              >
                <Link className="w-4 h-4" />
                <span>{isLoading ? 'Shortening...' : 'Shorten URLs'}</span>
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
