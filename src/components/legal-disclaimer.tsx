import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function LegalDisclaimer() {
  return (
    <Alert variant="destructive" className="mt-6 bg-orange-50 border-orange-200 text-orange-800 [&>svg]:text-orange-500">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Educational Use Only</AlertTitle>
      <AlertDescription>
        This tool is for educational and informational purposes only. Use it responsibly and ethically. Unauthorized security testing is illegal.
      </AlertDescription>
    </Alert>
  );
}
