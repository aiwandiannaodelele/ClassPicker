'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';

interface LegalDocsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  docType: 'privacy' | 'terms';
}

const DynamicContent = ({ t, baseKey, titleKey }: { t: (key: string, ...args: any[]) => string, baseKey: string, titleKey: string }) => {
  const paragraphs = [];
  let i = 1;
  // Add a hard limit to the loop as a safeguard against infinite loops.
  while (i < 50) { // Assuming no document will have more than 50 paragraphs.
    const key = `${baseKey}_p${i}`;
    const content = t(key);
    
    // This is a more robust check. It will break if the translation is missing,
    // regardless of whether the `t` function returns undefined, null, an empty string, or the key itself.
    if (!content || content === key) {
      break;
    }
    
    paragraphs.push(<p key={i} className="mb-3">{content}</p>);
    i++;
  }

  return (
    <>
      <h3 className="font-bold mt-4 mb-2 text-lg">{t(titleKey)}</h3>
      {paragraphs}
    </>
  );
};

export function LegalDocs({ open, onOpenChange, docType }: LegalDocsProps) {
  const { t } = useLanguage();

  const title = docType === 'privacy' ? t('privacy_policy') : t('terms_of_service');
  const baseKey = docType === 'privacy' ? 'privacy_policy' : 'terms_of_service';
  const titleKey = `${baseKey}_title`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-4 text-sm text-muted-foreground">
          <DynamicContent t={t} baseKey={baseKey} titleKey={titleKey} />
        </div>
        <DialogClose asChild>
          <Button className="mt-4 w-full cursor-pointer">{t('alert_confirm')}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
