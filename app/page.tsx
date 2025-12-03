'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RotateCcw, Upload, Users, Hash, Repeat, X, FileText, AlertTriangle, Loader2, Settings, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import useLocalStorage from '@/hooks/useLocalStorage';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SoundEffect = 'none' | 'applause' | 'pop' | 'firework';

export default function Page(): React.ReactElement {
    const { language, setLanguage, t } = useLanguage();
    
    const [currentDisplay, setCurrentDisplay] = useState<string>('0');
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [studentList, setStudentList] = useState<string[]>([]);
    const [selectedHistory, setSelectedHistory] = useState<string[]>([]);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [newBlacklistItem, setNewBlacklistItem] = useState('');

    // Persisted state
    const [maxId, setMaxId] = useLocalStorage<number>('maxId', 45);
    const [mode, setMode] = useLocalStorage<'id' | 'list'>('mode', 'id');
    const [isInstant, setIsInstant] = useLocalStorage<boolean>('isInstant', false);
    const [isNoRepeat, setIsNoRepeat] = useLocalStorage<boolean>('isNoRepeat', false);
    const [blacklist, setBlacklist] = useLocalStorage<string[]>('blacklist', []);
    const [soundEffect, setSoundEffect] = useLocalStorage<SoundEffect>('soundEffect', 'pop');

    const intervalRef = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const displayRef = useRef<HTMLDivElement | null>(null);

    const blacklistedItems = useMemo(() => new Set(blacklist), [blacklist]);

    const allItems = useMemo(() => {
        if (mode === 'id') {
            const allIds = Array.from({ length: maxId }, (_, i) => String(i + 1));
            return allIds.filter(id => !blacklistedItems.has(id));
        }
        return studentList;
    }, [mode, maxId, studentList, blacklistedItems]);

    const remainingItems = useMemo(() => {
        if (isNoRepeat) return allItems.filter(item => !selectedHistory.includes(item));
        return allItems;
    }, [allItems, isNoRepeat, selectedHistory]);

    const playSound = useCallback(() => {
        if (soundEffect === 'none') return;
        const audio = new Audio(`/sounds/${soundEffect}.wav`);
        audio.play().catch(error => console.error("Audio play failed:", error));
    }, [soundEffect]);

    const stopAnimation = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const resetGame = useCallback(() => {
        stopAnimation();
        setSelectedHistory([]);
        setIsRunning(false);
        if (mode === 'id') setCurrentDisplay(t('display_range', maxId));
        else setCurrentDisplay(studentList.length > 0 ? t('display_total', studentList.length) : t('display_upload_prompt'));
    }, [mode, maxId, studentList.length, t]);

    useEffect(() => {
        resetGame();
    }, [mode, studentList.length, maxId, resetGame]);

    const getFontSize = (text: string): string => {
        const len = String(text).length;
        if (len <= 3) return 'text-6xl md:text-7xl';
        if (len <= 6) return 'text-5xl md:text-6xl';
        if (len <= 9) return 'text-3xl md:text-4xl';
        return 'text-2xl md:text-3xl';
    };

    const displayAlert = useCallback((message: string) => {
        setAlertMessage(message);
        setShowAlert(true);
    }, []);

    const handleAddBlacklistItem = () => {
        const trimmedItem = newBlacklistItem.trim();
        if (!trimmedItem) {
            displayAlert(t('alert_invalid_id'));
            return;
        }
        if (blacklist.includes(trimmedItem)) {
            displayAlert(t('alert_id_in_blacklist', trimmedItem));
            return;
        }
        setBlacklist([...blacklist, trimmedItem]);
        setNewBlacklistItem('');
    };

    const handleRemoveBlacklistItem = (itemToRemove: string) => {
        setBlacklist(blacklist.filter(item => item !== itemToRemove));
    };

    const pickWinner = useCallback((candidates: string[]) => {
        if (candidates.length === 0) {
            if (isNoRepeat && allItems.length > 0) displayAlert(t('all_drawn_prompt'));
            return;
        }
        const winner = candidates[Math.floor(Math.random() * candidates.length)];
        setCurrentDisplay(winner);
        playSound();

        if (isNoRepeat) {
            setSelectedHistory(prev => {
                const newHistory = [...prev, winner];
                if (newHistory.length === allItems.length) {
                    setTimeout(() => displayAlert(t('all_drawn_congrats')), 500);
                }
                return newHistory;
            });
        }

        if (displayRef.current) {
            displayRef.current.classList.remove('scale-100');
            displayRef.current.classList.add('scale-105', 'ring-4', 'ring-primary/50');
            setTimeout(() => {
                displayRef.current?.classList.remove('scale-105', 'ring-4', 'ring-primary/50');
                displayRef.current?.classList.add('scale-100');
            }, 400);
        }
    }, [allItems.length, isNoRepeat, displayAlert, t, playSound]);

    const handleStop = useCallback(() => {
        stopAnimation();
        if (isRunning) {
            pickWinner(remainingItems);
            setIsRunning(false);
        }
    }, [isRunning, remainingItems, pickWinner]);

    const handleStart = useCallback(() => {
        if ((mode === 'list' && studentList.length === 0)) {
            displayAlert(t('alert_list_empty'));
            return;
        }
        if (mode === 'id' && maxId < 1) {
            displayAlert(t('alert_id_zero'));
            return;
        }
        if (isNoRepeat && remainingItems.length === 0) {
            displayAlert(t('alert_all_drawn_restart'));
            return;
        }

        setIsRunning(true);
        const candidates = remainingItems;

        if (isInstant) {
            setTimeout(() => {
                pickWinner(candidates);
                setIsRunning(false);
            }, 50);
        } else {
            intervalRef.current = window.setInterval(() => {
                setCurrentDisplay(candidates[Math.floor(Math.random() * candidates.length)]);
            }, 50);
        }
    }, [mode, studentList.length, maxId, isNoRepeat, remainingItems, isInstant, displayAlert, pickWinner, t]);

    const handleToggle = useCallback(() => isRunning ? handleStop() : handleStart(), [isRunning, handleStop, handleStart]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('text/plain')) {
            displayAlert(t('alert_invalid_file'));
            e.target.value = '';
            return;
        }

        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            const list = (event.target?.result as string).split('\n').map(n => n.trim()).filter(Boolean);
            if (list.length === 0) {
                displayAlert(t('alert_empty_file'));
                setStudentList([]);
            } else {
                setStudentList(list);
                setMode('list');
                setSelectedHistory([]);
                displayAlert(t('alert_import_success', list.length));
            }
            setIsUploading(false);
        };
        reader.onerror = () => {
            displayAlert(t('alert_read_error'));
            setIsUploading(false);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 select-none" onContextMenu={(e) => e.preventDefault()}>
            <Card className="w-full max-w-sm sm:max-w-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/icon.png" alt="App Icon" className="h-6 w-6" />
                        <CardTitle>{t('title')}</CardTitle>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={t('settings')} className="cursor-pointer">
                                <Settings className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>{t('settings')}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="blacklist">{t('blacklist_label')}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="blacklist"
                                            placeholder={t('blacklist_placeholder')}
                                            value={newBlacklistItem}
                                            onChange={(e) => setNewBlacklistItem(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddBlacklistItem()}
                                        />
                                        <Button onClick={handleAddBlacklistItem} className="cursor-pointer">{t('add_button')}</Button>
                                    </div>
                                    {blacklist.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {blacklist.map(item => (
                                                <Badge key={item} variant="secondary" className="flex items-center gap-1">
                                                    {item}
                                                    <button onClick={() => handleRemoveBlacklistItem(item)} className="rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>{t('sound_effect_label')}</Label>
                                    <Select value={soundEffect} onValueChange={(value: SoundEffect) => setSoundEffect(value)}>
                                        <SelectTrigger className="w-[180px] cursor-pointer">
                                            <SelectValue placeholder={t('sound_effect_label')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none" className="cursor-pointer">{t('sound_effect_none')}</SelectItem>
                                            <SelectItem value="pop" className="cursor-pointer">{t('sound_effect_pop')}</SelectItem>
                                            <SelectItem value="applause" className="cursor-pointer">{t('sound_effect_applause')}</SelectItem>
                                            <SelectItem value="firework" className="cursor-pointer">{t('sound_effect_firework')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>{t('language')}</Label>
                                    <Tabs value={language} onValueChange={(value) => setLanguage(value as 'zh' | 'en')} className="w-[180px]">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="zh" className="cursor-pointer">{t('language_zh')}</TabsTrigger>
                                            <TabsTrigger value="en" className="cursor-pointer">{t('language_en')}</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                                <p className="text-xs text-muted-foreground text-center pt-4">
                                    {t('version')} 2.0.0<br />
                                    {t('about_author')} aiwandiannaodelele/龚奕帆 <br /> {t('mit_license')}
                                </p>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="relative group">
                        <div ref={displayRef} className={cn("h-48 rounded-lg flex items-center justify-center transition-all duration-300 ease-out transform scale-100 shadow-inner border", !isRunning && isNoRepeat && selectedHistory.includes(currentDisplay) ? 'bg-primary/10 border-primary' : 'bg-muted/50 border-border')}>
                            {isRunning && !isInstant && <Loader2 className="absolute h-8 w-8 text-primary animate-spin" />}
                            <span className={cn("font-extrabold transition-all duration-300 text-center px-4 leading-tight break-all", isRunning && !isInstant ? 'text-muted-foreground blur-md' : 'text-primary', getFontSize(currentDisplay))}>
                                {currentDisplay}
                            </span>
                        </div>
                        {isNoRepeat && allItems.length > 0 && (
                            <Badge variant="outline" className="absolute top-3 right-3">
                                {t('remaining')}: <span className={cn("font-bold ml-1", remainingItems.length === 0 ? 'text-destructive' : 'text-green-600')}>{remainingItems.length}</span>
                            </Badge>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={handleToggle}
                            className="flex-1 h-12 text-lg cursor-pointer"
                            variant={isRunning ? "destructive" : "default"}
                            disabled={isUploading || (isNoRepeat && remainingItems.length === 0)}
                        >
                            {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('loading_button')}</> : (isRunning ? t('stop_button') : t('start_button'))}
                        </Button>
                        {isNoRepeat && (
                            <Button onClick={resetGame} variant="outline" size="icon" className="h-12 w-12 cursor-pointer" aria-label={t('reset_button_label')} disabled={isRunning || isUploading}>
                                <RotateCcw className="h-5 w-5" />
                            </Button>
                        )}
                    </div>

                    <Tabs value={mode} onValueChange={(v) => setMode(v as 'id' | 'list')} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="id" disabled={isRunning} className="cursor-pointer"><Hash className="h-4 w-4 mr-2" />{t('id_mode_tab')}</TabsTrigger>
                            <TabsTrigger value="list" disabled={isRunning} className="cursor-pointer"><Users className="h-4 w-4 mr-2" />{t('list_mode_tab')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="id" className="mt-4 space-y-4">
                             <div className="flex items-center justify-between">
                                <Label htmlFor="maxId" className="flex items-center gap-2">
                                    <Hash className="h-4 w-4" /> {t('id_range_label', maxId)}
                                </Label>
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="icon" onClick={() => setMaxId(p => Math.max(1, p - 1))} disabled={isRunning} className="cursor-pointer"><span className="sr-only">-</span>-</Button>
                                    <Input id="maxId" type="number" value={maxId} onChange={(e) => setMaxId(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 text-center" min="1" disabled={isRunning} />
                                    <Button variant="outline" size="icon" onClick={() => setMaxId(p => p + 1)} disabled={isRunning} className="cursor-pointer"><span className="sr-only">+</span>+</Button>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="list" className="mt-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <Label className="flex items-center gap-2"><FileText className="h-4 w-4" />{t('list_file_label')}</Label>
                                <Badge variant="secondary">{t('list_file_count', studentList.length)}</Badge>
                            </div>
                            <Button variant="outline" className="w-full border-dashed cursor-pointer" onClick={() => fileInputRef.current?.click()} disabled={isRunning || isUploading}>
                                {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('reading_file_button_text')}</> : <><Upload className="mr-2 h-4 w-4" />{studentList.length > 0 ? t('replace_list_button_text') : t('upload_button_text')}</>}
                            </Button>
                            <Input type="file" ref={fileInputRef} className="hidden" accept=".txt" onChange={handleFileUpload} disabled={isRunning || isUploading} />
                        </TabsContent>
                    </Tabs>

                    <Card className="p-5">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="instant-mode" className="flex items-center gap-3 cursor-pointer"><Zap className="h-5 w-5" />{t('instant_mode_label')}</Label>
                                <Switch id="instant-mode" checked={isInstant} onCheckedChange={setIsInstant} disabled={isRunning} className="cursor-pointer"/>
                            </div>
                             <div className="flex items-center justify-between">
                                <Label htmlFor="no-repeat-mode" className="flex items-center gap-3 cursor-pointer"><Repeat className="h-5 w-5" />{t('no_repeat_mode_label')}</Label>
                                <Switch id="no-repeat-mode" checked={isNoRepeat} onCheckedChange={setIsNoRepeat} disabled={isRunning} className="cursor-pointer"/>
                            </div>
                        </div>
                    </Card>

                    {isNoRepeat && selectedHistory.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">{t('history_label', selectedHistory.length, allItems.length)}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                                {selectedHistory.map((item, index) => <Badge key={index} variant="outline">{item}</Badge>)}
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-4">
                            <AlertTriangle className="h-5 w-5 text-primary" />
                        </div>
                        <AlertDialogTitle className="text-center">{t('alert_title')}</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            {alertMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="w-full cursor-pointer" onClick={() => setShowAlert(false)}>{t('alert_confirm')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
