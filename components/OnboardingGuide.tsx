'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hash, Users, Settings, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const steps = [
  {
    titleKey: 'onboarding_step1_title',
    contentKey: 'onboarding_step1_content',
    icon: '/icon.png', // App icon
  },
  {
    titleKey: 'onboarding_step2_title',
    contentKey: 'onboarding_step2_content',
    icon: [Hash, Users], // Lucide icons
  },
  {
    titleKey: 'onboarding_step3_title',
    contentKey: 'onboarding_step3_content',
    icon: [Settings], // Lucide icon
  },
  {
    titleKey: 'onboarding_step4_title',
    contentKey: 'onboarding_step4_content',
    icon: '/icon.png', // App icon
  },
];

interface OnboardingGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish: () => void;
}

export function OnboardingGuide({ open, onOpenChange, onFinish }: OnboardingGuideProps) {
  const [step, setStep] = useState(0);
  const { t } = useLanguage();

  const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 0));

  const currentStep = steps[step];

  const handleClose = () => {
    onFinish();
    onOpenChange(false);
    setTimeout(() => setStep(0), 300);
  };

  const renderIcon = () => {
    if (!currentStep.icon) return null;

    if (typeof currentStep.icon === 'string') {
      return <Image src={currentStep.icon} alt="App Icon" width={40} height={40} className="mb-4" />;
    }

    if (Array.isArray(currentStep.icon)) {
      return (
        <div className="flex gap-4 mb-4">
          {currentStep.icon.map((IconComponent, index) => (
            <IconComponent key={index} className="h-8 w-8 text-primary" />
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {t(currentStep.titleKey)}
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-none shadow-none">
          <CardContent className="pt-6 text-center text-muted-foreground min-h-[120px] flex flex-col justify-center items-center">
            {renderIcon()}
            <p>{t(currentStep.contentKey)}</p>
          </CardContent>
        </Card>

        <div className="flex justify-center items-center space-x-2 my-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${step === index ? 'w-4 bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button variant="ghost" onClick={handleClose} className="cursor-pointer">
            {t('onboarding_skip')}
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={handlePrev} className="cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-1" /> {t('onboarding_previous')}
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={handleNext} className="cursor-pointer">
                {t('onboarding_next')} <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleClose} className="cursor-pointer">
                {t('onboarding_finish')}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
