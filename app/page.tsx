'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RotateCcw, Upload, Users, Hash, Repeat, X, AlertTriangle, Loader2, Settings, Zap, ShieldCheck, FileBadge, HelpCircle, History, Trash2, Pencil, Download, SlidersHorizontal, ListChecks } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import useLocalStorage from '@/hooks/useLocalStorage';
import useWindowSize from '@/hooks/useWindowSize';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { OnboardingGuide } from '@/components/OnboardingGuide';
import { LegalDocs } from '@/components/LegalDocs';
import { cn } from "@/lib/utils";
import { Language } from '@/lib/i18n';

// Types
type SoundEffect = 'none' | 'applause' | 'pop' | 'firework';
type LegalDocType = 'privacy' | 'terms';
type RollHistoryItem = {
    name: string;
    time: string;
};
type StudentList = {
    name: string;
    students: string[];
};

// Common Props for Layouts
interface LayoutProps {
    page: PageState;
    handlers: PageHandlers;
    refs: PageRefs;
}

interface PageState {
    language: Language;
    t: (key: any, ...args: any[]) => string;
    currentDisplay: string;
    isRunning: boolean;
    selectedHistory: string[];
    isUploading: boolean;
    newBlacklistItem: string;
    isSettingsOpen: boolean;
    isSetupSheetOpen: boolean;
    isHistoryOpen: boolean;
    isGuideOpen: boolean;
    isLegalDocOpen: boolean;
    activeLegalDoc: LegalDocType;
    isSaveListDialogOpen: boolean;
    newListName: string;
    listToRename: StudentList | null;
    renameInput: string;
    maxId: number;
    mode: 'id' | 'list';
    isInstant: boolean;
    isNoRepeat: boolean;
    blacklist: string[];
    soundEffect: SoundEffect;
    rollHistory: RollHistoryItem[];
    savedLists: StudentList[];
    activeListName: string | null;
    studentList: string[];
    allItems: string[];
    remainingItems: string[];
    showAlert: boolean;
    alertMessage: string;
}

interface PageHandlers {
    setLanguage: (lang: Language) => void;
    handleToggle: () => void;
    resetGame: () => void;
    setMode: (mode: 'id' | 'list') => void;
    setMaxId: (value: number | ((prev: number) => number)) => void;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSaveNewList: () => void;
    handleDeleteList: (list: StudentList) => void;
    handleRenameList: () => void;
    handleExportList: (list: StudentList) => void;
    setIsInstant: (value: boolean | ((prev: boolean) => boolean)) => void;
    setIsNoRepeat: (value: boolean | ((prev: boolean) => boolean)) => void;
    setNewBlacklistItem: (value: string) => void;
    handleAddBlacklistItem: () => void;
    handleRemoveBlacklistItem: (item: string) => void;
    setSoundEffect: (value: SoundEffect | ((prev: SoundEffect) => SoundEffect)) => void;
    handleShowGuide: () => void;
    handleShowLegalDoc: (docType: LegalDocType) => void;
    handleClearHistory: () => void;
    setIsSettingsOpen: (open: boolean) => void;
    setIsSetupSheetOpen: (open: boolean) => void;
    setIsHistoryOpen: (open: boolean) => void;
    setIsGuideOpen: (open: boolean) => void;
    setIsLegalDocOpen: (open: boolean) => void;
    setIsSaveListDialogOpen: (open: boolean) => void;
    setNewListName: (name: string) => void;
    setListToRename: (list: StudentList | null) => void;
    setRenameInput: (name: string) => void;
    setActiveListName: (name: string | null) => void;
    setShowAlert: (open: boolean) => void;
    getFontSize: (text: string) => string;
    setHasOnboarded: (value: boolean) => void;
}

interface PageRefs {
    fileInputRef: React.RefObject<HTMLInputElement>;
    displayRef: React.RefObject<HTMLDivElement>;
}

// Main Page Component
export default function Page(): React.ReactElement {
    const { language, setLanguage, t } = useLanguage();
    const { width, height } = useWindowSize();
    
    const [currentDisplay, setCurrentDisplay] = useState<string>('0');
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [selectedHistory, setSelectedHistory] = useState<string[]>([]);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [newBlacklistItem, setNewBlacklistItem] = useState('');
    
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSetupSheetOpen, setIsSetupSheetOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isLegalDocOpen, setIsLegalDocOpen] = useState(false);
    const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>('privacy');
    
    const [isSaveListDialogOpen, setIsSaveListDialogOpen] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListData, setNewListData] = useState<string[]>([]);
    const [listToRename, setListToRename] = useState<StudentList | null>(null);
    const [renameInput, setRenameInput] = useState('');

    const [maxId, setMaxId] = useLocalStorage<number>('maxId', 45);
    const [mode, setMode] = useLocalStorage<'id' | 'list'>('mode', 'id');
    const [isInstant, setIsInstant] = useLocalStorage<boolean>('isInstant', false);
    const [isNoRepeat, setIsNoRepeat] = useLocalStorage<boolean>('isNoRepeat', false);
    const [blacklist, setBlacklist] = useLocalStorage<string[]>('blacklist', []);
    const [soundEffect, setSoundEffect] = useLocalStorage<SoundEffect>('soundEffect', 'none');
    const [hasOnboarded, setHasOnboarded] = useLocalStorage<boolean>('hasOnboarded', false);
    const [rollHistory, setRollHistory] = useLocalStorage<RollHistoryItem[]>('rollHistory', []);
    const [savedLists, setSavedLists] = useLocalStorage<StudentList[]>('savedLists', []);
    const [activeListName, setActiveListName] = useLocalStorage<string | null>('activeListName', null);

    const intervalRef = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const displayRef = useRef<HTMLDivElement | null>(null);

    const studentList = useMemo(() => {
        if (mode !== 'list' || !activeListName) return [];
        const activeList = savedLists.find(list => list.name === activeListName);
        return activeList ? activeList.students : [];
    }, [savedLists, activeListName, mode]);

    useEffect(() => {
        if (!hasOnboarded) {
            setTimeout(() => setIsGuideOpen(true), 100);
        }
    }, [hasOnboarded]);

    const handleShowGuide = () => {
        setIsSettingsOpen(false);
        setTimeout(() => setIsGuideOpen(true), 150);
    };

    const handleShowLegalDoc = (docType: LegalDocType) => {
        setIsSettingsOpen(false);
        setActiveLegalDoc(docType);
        setTimeout(() => setIsLegalDocOpen(true), 150);
    };

    const handleClearHistory = () => {
        setRollHistory([]);
        setIsHistoryOpen(false);
    };

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
        if (mode === 'id') {
            setCurrentDisplay(t('display_range', maxId));
        } else {
            setCurrentDisplay(studentList.length > 0 ? t('display_total', studentList.length) : t('display_import_prompt'));
        }
    }, [mode, maxId, studentList.length, t]);

    useEffect(() => {
        resetGame();
    }, [mode, studentList, maxId, resetGame, activeListName]);
    
    useEffect(() => {
        if (mode === 'list' && activeListName && !savedLists.some(l => l.name === activeListName)) {
            setActiveListName(savedLists.length > 0 ? savedLists[0].name : null);
        }
    }, [savedLists, activeListName, mode, setActiveListName]);

    const getFontSize = (text: string): string => {
        const len = String(text).length;
        if (width / height <= 1) { // Small screen layout font sizes
            if (len <= 4) return 'text-7xl md:text-8xl';
            if (len <= 8) return 'text-6xl md:text-7xl';
            if (len <= 12) return 'text-4xl md:text-5xl';
            return 'text-3xl md:text-4xl';
        } else { // Large screen layout font sizes
            if (len <= 3) return 'text-6xl md:text-7xl';
            if (len <= 6) return 'text-5xl md:text-6xl';
            if (len <= 9) return 'text-3xl md:text-4xl';
            return 'text-2xl md:text-3xl';
        }
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

        const newHistoryItem = { name: winner, time: new Date().toLocaleString() };
        setRollHistory(prev => [newHistoryItem, ...prev]);

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
    }, [allItems.length, isNoRepeat, displayAlert, t, playSound, setRollHistory]);

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

        const candidates = remainingItems;
        if (isInstant) {
            pickWinner(candidates);
            return;
        }
        
        setIsRunning(true);
        intervalRef.current = window.setInterval(() => {
            setCurrentDisplay(candidates[Math.floor(Math.random() * candidates.length)]);
        }, 50);
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
            } else {
                setNewListData(list);
                setNewListName(file.name.replace(/\.txt$/, ''));
                setIsSaveListDialogOpen(true);
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

    const handleSaveNewList = () => {
        const trimmedName = newListName.trim();
        if (!trimmedName) {
            displayAlert(t('alert_list_name_empty'));
            return;
        }
        if (savedLists.some(list => list.name === trimmedName)) {
            displayAlert(t('alert_list_name_exists'));
            return;
        }
    
        const newList: StudentList = { name: trimmedName, students: newListData };
        setSavedLists([...savedLists, newList]);
        setActiveListName(trimmedName);
        setMode('list');
        setSelectedHistory([]);
        displayAlert(t('alert_import_success', newListData.length));
    
        setIsSaveListDialogOpen(false);
        setNewListName('');
        setNewListData([]);
    };

    const handleDeleteList = (listToDelete: StudentList) => {
        if (!listToDelete) return;
        const newLists = savedLists.filter(list => list.name !== listToDelete.name);
        setSavedLists(newLists);
        if (activeListName === listToDelete.name) {
            setActiveListName(newLists.length > 0 ? newLists[0].name : null);
        }
        setSelectedHistory([]);
    };

    const handleRenameList = () => {
        if (!listToRename) return;
        const newName = renameInput.trim();
        if (!newName) {
            displayAlert(t('alert_list_name_empty'));
            return;
        }
        if (newName !== listToRename.name && savedLists.some(list => list.name === newName)) {
            displayAlert(t('alert_list_name_exists'));
            return;
        }
        setSavedLists(savedLists.map(list => list.name === listToRename.name ? { ...list, name: newName } : list));
        if (activeListName === listToRename.name) {
            setActiveListName(newName);
        }
        setListToRename(null);
        setRenameInput('');
    };

    const handleExportList = (list: StudentList) => {
        const content = list.students.join('\n');
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${list.name}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const pageState: PageState = {
        language, t, currentDisplay, isRunning, selectedHistory, isUploading, newBlacklistItem,
        isSettingsOpen, isSetupSheetOpen, isHistoryOpen, isGuideOpen, isLegalDocOpen, activeLegalDoc,
        isSaveListDialogOpen, newListName, listToRename, renameInput, maxId, mode, isInstant,
        isNoRepeat, blacklist, soundEffect, rollHistory, savedLists, activeListName, studentList,
        allItems, remainingItems, showAlert, alertMessage
    };

    const pageHandlers: PageHandlers = {
        setLanguage, handleToggle, resetGame, setMode, setMaxId, handleFileUpload, handleSaveNewList,
        handleDeleteList, handleRenameList, handleExportList, setIsInstant, setIsNoRepeat,
        setNewBlacklistItem, handleAddBlacklistItem, handleRemoveBlacklistItem, setSoundEffect,
        handleShowGuide, handleShowLegalDoc, handleClearHistory, setIsSettingsOpen, setIsSetupSheetOpen,
        setIsHistoryOpen, setIsGuideOpen, setIsLegalDocOpen, setIsSaveListDialogOpen, setNewListName,
        setListToRename, setRenameInput, setActiveListName, setShowAlert, getFontSize, setHasOnboarded
    };

    const pageRefs: PageRefs = { fileInputRef, displayRef };

    const isWide = width / height > 1;

    return (
        <>
            {isWide ? <LargeScreenLayout page={pageState} handlers={pageHandlers} refs={pageRefs} /> : <SmallScreenLayout page={pageState} handlers={pageHandlers} refs={pageRefs} />}
            
            {/* Common Modals and Dialogs */}
            <Dialog open={pageState.isSaveListDialogOpen} onOpenChange={pageHandlers.setIsSaveListDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{t('save_new_list_title')}</DialogTitle></DialogHeader>
                    <div className="space-y-2 px-4 py-4">
                        <Label htmlFor="new-list-name">{t('list_name_label')}</Label>
                        <Input id="new-list-name" value={pageState.newListName} onChange={(e) => pageHandlers.setNewListName(e.target.value)} placeholder={t('list_name_placeholder')} onKeyDown={(e) => e.key === 'Enter' && pageHandlers.handleSaveNewList()} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => pageHandlers.setIsSaveListDialogOpen(false)} className="cursor-pointer">{t('cancel_button')}</Button>
                        <Button onClick={pageHandlers.handleSaveNewList} className="cursor-pointer">{t('save_button')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!pageState.listToRename} onOpenChange={(open) => !open && pageHandlers.setListToRename(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{t('rename_list_title')}</DialogTitle></DialogHeader>
                    <div className="space-y-2 px-4 py-4">
                        <Label htmlFor="rename-list-input">{t('list_name_label')}</Label>
                        <Input id="rename-list-input" value={pageState.renameInput} onChange={(e) => pageHandlers.setRenameInput(e.target.value)} placeholder={t('list_name_placeholder')} onKeyDown={(e) => e.key === 'Enter' && pageHandlers.handleRenameList()} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => pageHandlers.setListToRename(null)} className="cursor-pointer">{t('cancel_button')}</Button>
                        <Button onClick={pageHandlers.handleRenameList} className="cursor-pointer">{t('save_button')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={pageState.showAlert} onOpenChange={pageHandlers.setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-4"><AlertTriangle className="h-5 w-5 text-primary" /></div>
                        <AlertDialogTitle className="text-center">{t('alert_title')}</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">{pageState.alertMessage}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogAction className="w-full cursor-pointer" onClick={() => pageHandlers.setShowAlert(false)}>{t('alert_confirm')}</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <OnboardingGuide open={pageState.isGuideOpen} onOpenChange={pageHandlers.setIsGuideOpen} onFinish={() => pageHandlers.setHasOnboarded(true)} />
            <LegalDocs open={pageState.isLegalDocOpen} onOpenChange={pageHandlers.setIsLegalDocOpen} docType={pageState.activeLegalDoc} />
        </>
    );
}

// Small Screen Layout for Tauri/Mobile
const SmallScreenLayout: React.FC<LayoutProps> = ({ page, handlers, refs }) => {
    const { t, currentDisplay, isRunning, isNoRepeat, selectedHistory, allItems, remainingItems, isUploading, isHistoryOpen, isSettingsOpen, isSetupSheetOpen, rollHistory, blacklist, newBlacklistItem, soundEffect, language } = page;
    const { handleToggle, resetGame, setIsHistoryOpen, handleClearHistory, setIsSettingsOpen, handleAddBlacklistItem, handleRemoveBlacklistItem, setNewBlacklistItem, setSoundEffect, setLanguage, handleShowGuide, handleShowLegalDoc, setIsSetupSheetOpen, setMode, setMaxId, handleFileUpload, setActiveListName, setListToRename, setRenameInput, handleExportList, handleDeleteList, setIsInstant, setIsNoRepeat } = handlers;
    const { fileInputRef, displayRef } = refs;

    return (
        <div className="h-screen bg-background text-foreground flex flex-col p-4 select-none">
            <main className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto">
                <div className="w-full relative group flex-1 flex items-center justify-center">
                    <div ref={displayRef} className={cn("h-full w-full rounded-lg flex items-center justify-center transition-all duration-300 ease-out transform scale-100 shadow-inner border", !isRunning && isNoRepeat && selectedHistory.includes(currentDisplay) ? 'bg-primary/10 border-primary' : 'bg-muted/50 border-border')}>
                        {isRunning && !page.isInstant && <Loader2 className="absolute h-10 w-10 text-primary animate-spin" />}
                        <span className={cn("font-extrabold transition-all duration-300 text-center px-6 leading-tight break-all", isRunning && !page.isInstant ? 'text-muted-foreground blur-md' : 'text-primary', handlers.getFontSize(currentDisplay))}>
                            {currentDisplay}
                        </span>
                    </div>
                    {isNoRepeat && allItems.length > 0 && (
                        <Badge variant="outline" className="absolute top-4 right-4">
                            {t('remaining')}: <span className={cn("font-bold ml-1", remainingItems.length === 0 ? 'text-destructive' : 'text-green-600')}>{remainingItems.length}</span>
                        </Badge>
                    )}
                </div>

                <div className="w-full py-6">
                    <Button onClick={handleToggle} className="w-full h-16 text-xl cursor-pointer" variant={isRunning ? "destructive" : "default"} disabled={isUploading || (isNoRepeat && remainingItems.length === 0)}>
                        {isUploading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t('loading_button')}</> : (isRunning ? t('stop_button') : t('start_button'))}
                    </Button>
                </div>
            </main>

            <footer className="w-full max-w-md mx-auto p-2 border-t">
                <div className="flex justify-around items-center">
                    <Sheet open={isSetupSheetOpen} onOpenChange={setIsSetupSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={t('setup_title')} className="cursor-pointer"><SlidersHorizontal className="h-6 w-6" /></Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="rounded-t-lg max-h-[80vh]">
                            <SheetHeader><SheetTitle>{t('setup_title')}</SheetTitle></SheetHeader>
                            <div className="px-4 py-4 space-y-6 overflow-y-auto">
                                <Tabs value={page.mode} onValueChange={(v) => setMode(v as 'id' | 'list')} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="id" disabled={isRunning} className="cursor-pointer"><Hash className="h-4 w-4 mr-2" />{t('id_mode_tab')}</TabsTrigger>
                                        <TabsTrigger value="list" disabled={isRunning} className="cursor-pointer"><Users className="h-4 w-4 mr-2" />{t('list_mode_tab')}</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="id" className="mt-4 space-y-4">
                                        <div className="flex items-center justify-between flex-wrap">
                                            <Label htmlFor="maxId" className="flex items-center gap-2"><Hash className="h-4 w-4" /> {t('id_range_label', page.maxId)}</Label>
                                            <div className="flex items-center gap-1">
                                                <Button variant="outline" size="icon" onClick={() => setMaxId(p => Math.max(1, p - 1))} disabled={isRunning} className="cursor-pointer"><span className="sr-only">-</span>-</Button>
                                                <Input id="maxId" type="number" value={page.maxId} onChange={(e) => setMaxId(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 text-center" min="1" disabled={isRunning} />
                                                <Button variant="outline" size="icon" onClick={() => setMaxId(p => p + 1)} disabled={isRunning} className="cursor-pointer"><span className="sr-only">+</span>+</Button>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="list" className="mt-4 space-y-4">
                                        {page.savedLists.length > 0 ? (
                                            <Card>
                                                <CardHeader className="p-3"><CardTitle className="text-sm">{t('all_lists_title')}</CardTitle></CardHeader>
                                                <CardContent className="p-0">
                                                    <div className="max-h-40 overflow-y-auto border-t">
                                                        {page.savedLists.map((list) => (
                                                            <div key={list.name} className="flex items-center gap-1 p-2 hover:bg-muted border-b last:border-b-0">
                                                                <Button variant={page.activeListName === list.name ? 'secondary' : 'ghost'} className="flex-1 justify-start cursor-pointer h-auto py-1 text-left" onClick={() => { setActiveListName(list.name); setIsSetupSheetOpen(false); }}>
                                                                    <div className="flex flex-col items-start">
                                                                        <span className="truncate max-w-[120px] sm:max-w-full">{list.name}</span>
                                                                        <span className="text-xs text-muted-foreground">{t('list_file_count', list.students.length)}</span>
                                                                    </div>
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="shrink-0" onClick={() => { setListToRename(list); setRenameInput(list.name); }}><Pencil className="h-4 w-4" /></Button>
                                                                <Button variant="ghost" size="icon" className="shrink-0" onClick={() => handleExportList(list)}><Download className="h-4 w-4" /></Button>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="cursor-pointer shrink-0"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader><AlertDialogTitle>{t('delete_list_confirm_title')}</AlertDialogTitle><AlertDialogDescription>{t('delete_list_confirm_description', list.name)}</AlertDialogDescription></AlertDialogHeader>
                                                                        <AlertDialogFooter><AlertDialogCancel>{t('cancel_button')}</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteList(list)} className="bg-destructive hover:bg-destructive/90">{t('delete_button')}</AlertDialogAction></AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="p-2 border-t"><Button variant="outline" className="w-full cursor-pointer" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />{t('import_new_list_button')}</Button></CardFooter>
                                            </Card>
                                        ) : (
                                            <Button variant="outline" className="w-full border-dashed cursor-pointer h-24" onClick={() => fileInputRef.current?.click()} disabled={isRunning || isUploading}><div className="flex flex-col items-center gap-2"><Upload className="h-6 w-6" /><span>{t('import_first_list_button_text')}</span></div></Button>
                                        )}
                                        <Input type="file" ref={fileInputRef} className="hidden" accept=".txt" onChange={handleFileUpload} disabled={isRunning || isUploading} />
                                    </TabsContent>
                                </Tabs>
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex items-center justify-between"><Label htmlFor="instant-mode" className="flex items-center gap-3 cursor-pointer"><Zap className="h-5 w-5" />{t('instant_mode_label')}</Label><Switch id="instant-mode" checked={page.isInstant} onCheckedChange={setIsInstant} disabled={isRunning} className="cursor-pointer"/></div>
                                    <div className="flex items-center justify-between"><Label htmlFor="no-repeat-mode" className="flex items-center gap-3 cursor-pointer"><Repeat className="h-5 w-5" />{t('no_repeat_mode_label')}</Label><Switch id="no-repeat-mode" checked={page.isNoRepeat} onCheckedChange={setIsNoRepeat} disabled={isRunning} className="cursor-pointer"/></div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {isNoRepeat && <Button onClick={resetGame} variant="ghost" size="icon" aria-label={t('reset_button_label')} disabled={isRunning || isUploading} className="cursor-pointer"><RotateCcw className="h-6 w-6" /></Button>}

                    <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                        <DialogTrigger asChild><Button variant="ghost" size="icon" aria-label={t('roll_history')} className="cursor-pointer"><History className="h-6 w-6" /></Button></DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader><DialogTitle>{t('roll_history')}</DialogTitle></DialogHeader>
                            <div className="max-h-[60vh] overflow-y-auto">
                                <Table><TableHeader><TableRow><TableHead>{t('roll_history_name')}</TableHead><TableHead className="text-right">{t('roll_history_time')}</TableHead></TableRow></TableHeader>
                                    <TableBody>{rollHistory.map((item, index) => (<TableRow key={index}><TableCell className="font-medium">{item.name}</TableCell><TableCell className="text-right">{item.time}</TableCell></TableRow>))}</TableBody>
                                </Table>
                            </div>
                            <DialogFooter><Button variant="outline" onClick={handleClearHistory} disabled={rollHistory.length === 0} className="cursor-pointer">{t('roll_history_clear')}</Button><DialogClose asChild><Button className="cursor-pointer">{t('close')}</Button></DialogClose></DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                        <DialogTrigger asChild><Button variant="ghost" size="icon" aria-label={t('settings')} className="cursor-pointer"><Settings className="h-6 w-6" /></Button></DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader><DialogTitle>{t('settings')}</DialogTitle></DialogHeader>
                            <div className="space-y-6 px-4 py-4">
                                <div className="space-y-2"><Label htmlFor="blacklist">{t('blacklist_label')}</Label><div className="flex gap-2"><Input id="blacklist" placeholder={t('blacklist_placeholder')} value={newBlacklistItem} onChange={(e) => setNewBlacklistItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddBlacklistItem()} /><Button onClick={handleAddBlacklistItem} className="cursor-pointer">{t('add_button')}</Button></div>{blacklist.length > 0 && (<div className="flex flex-wrap gap-2 pt-2">{blacklist.map(item => (<Badge key={item} variant="secondary" className="flex items-center gap-1">{item}<button onClick={() => handleRemoveBlacklistItem(item)} className="rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer"><X className="h-3 w-3" /></button></Badge>))}</div>)}</div>
                                <div className="flex items-center justify-between"><Label>{t('sound_effect_label')}</Label><Select value={soundEffect} onValueChange={(value: SoundEffect) => setSoundEffect(value)}><SelectTrigger className="w-[180px] cursor-pointer"><SelectValue placeholder={t('sound_effect_label')} /></SelectTrigger><SelectContent><SelectItem value="none" className="cursor-pointer">{t('sound_effect_none')}</SelectItem><SelectItem value="pop" className="cursor-pointer">{t('sound_effect_pop')}</SelectItem><SelectItem value="applause" className="cursor-pointer">{t('sound_effect_applause')}</SelectItem><SelectItem value="firework" className="cursor-pointer">{t('sound_effect_firework')}</SelectItem></SelectContent></Select></div>
                                <div className="flex items-center justify-between"><Label>{t('language')}</Label><Select value={language} onValueChange={(value: Language) => setLanguage(value)}><SelectTrigger className="w-[180px] cursor-pointer"><SelectValue placeholder={t('language')} /></SelectTrigger><SelectContent><SelectItem value="zh" className="cursor-pointer">{t('language_zh')}</SelectItem><SelectItem value="zh-TW" className="cursor-pointer">{t('language_zh_tw')}</SelectItem><SelectItem value="en" className="cursor-pointer">{t('language_en')}</SelectItem><SelectItem value="ja" className="cursor-pointer">{t('language_ja')}</SelectItem><SelectItem value="ko" className="cursor-pointer">{t('language_ko')}</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2 pt-4 border-t"><Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer" onClick={handleShowGuide}><HelpCircle className="h-4 w-4" /> {t('show_guide')}</Button><Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer" onClick={() => handleShowLegalDoc('privacy')}><ShieldCheck className="h-4 w-4" /> {t('privacy_policy')}</Button><Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer" onClick={() => handleShowLegalDoc('terms')}><FileBadge className="h-4 w-4" /> {t('terms_of_service')}</Button></div>
                                <p className="text-xs text-muted-foreground text-center pt-4">v2.3.0 ({process.env.NEXT_PUBLIC_BUILD_ID?.slice(0, 7)})<br />{t('about_author')} aiwandiannaodelele/龚奕帆 <br /> {t('mit_license')}</p>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </footer>
        </div>
    );
};

// Large Screen Layout for Web
const LargeScreenLayout: React.FC<LayoutProps> = ({ page, handlers, refs }) => {
    const { t, currentDisplay, isRunning, isNoRepeat, selectedHistory, allItems, remainingItems, isUploading, isHistoryOpen, isSettingsOpen, rollHistory, blacklist, newBlacklistItem, soundEffect, language, mode, maxId, studentList, savedLists, activeListName } = page;
    const { handleToggle, resetGame, setIsHistoryOpen, handleClearHistory, setIsSettingsOpen, handleAddBlacklistItem, handleRemoveBlacklistItem, setNewBlacklistItem, setSoundEffect, setLanguage, handleShowGuide, handleShowLegalDoc, setMode, setMaxId, handleFileUpload, setActiveListName, setListToRename, setRenameInput, handleExportList, handleDeleteList, setIsInstant, setIsNoRepeat } = handlers;
    const { fileInputRef, displayRef } = refs;

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-2 select-none">
            <main className="w-full max-w-sm sm:max-w-md">
                <Card className="border-none shadow-none">
                    <CardContent className="space-y-6 pt-6">
                        <div className="relative group">
                            <div ref={displayRef} className={cn("h-48 rounded-lg flex items-center justify-center transition-all duration-300 ease-out transform scale-100 shadow-inner border", !isRunning && isNoRepeat && selectedHistory.includes(currentDisplay) ? 'bg-primary/10 border-primary' : 'bg-muted/50 border-border')}>
                                {isRunning && !page.isInstant && <Loader2 className="absolute h-8 w-8 text-primary animate-spin" />}
                                <span className={cn("font-extrabold transition-all duration-300 text-center px-4 leading-tight break-all", isRunning && !page.isInstant ? 'text-muted-foreground blur-md' : 'text-primary', handlers.getFontSize(currentDisplay))}>
                                    {currentDisplay}
                                </span>
                            </div>
                            {isNoRepeat && allItems.length > 0 && <Badge variant="outline" className="absolute top-3 right-3">{t('remaining')}: <span className={cn("font-bold ml-1", remainingItems.length === 0 ? 'text-destructive' : 'text-green-600')}>{remainingItems.length}</span></Badge>}
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={handleToggle} className="flex-1 h-12 text-lg cursor-pointer" variant={isRunning ? "destructive" : "default"} disabled={isUploading || (isNoRepeat && remainingItems.length === 0)}>
                                {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('loading_button')}</> : (isRunning ? t('stop_button') : t('start_button'))}
                            </Button>
                            {isNoRepeat && <Button onClick={resetGame} variant="outline" size="icon" className="h-12 w-12 cursor-pointer" aria-label={t('reset_button_label')} disabled={isRunning || isUploading}><RotateCcw className="h-5 w-5" /></Button>}
                        </div>

                        <Tabs value={mode} onValueChange={(v) => setMode(v as 'id' | 'list')} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="id" disabled={isRunning} className="cursor-pointer"><Hash className="h-4 w-4 mr-2" />{t('id_mode_tab')}</TabsTrigger>
                                <TabsTrigger value="list" disabled={isRunning} className="cursor-pointer"><Users className="h-4 w-4 mr-2" />{t('list_mode_tab')}</TabsTrigger>
                            </TabsList>
                            <TabsContent value="id" className="mt-4 space-y-4">
                                <div className="flex items-center justify-between flex-wrap">
                                    <Label htmlFor="maxId" className="flex items-center gap-2"><Hash className="h-4 w-4" /> {t('id_range_label', maxId)}</Label>
                                    <div className="flex items-center gap-1">
                                        <Button variant="outline" size="icon" onClick={() => setMaxId(p => Math.max(1, p - 1))} disabled={isRunning} className="cursor-pointer"><span className="sr-only">-</span>-</Button>
                                        <Input id="maxId" type="number" value={maxId} onChange={(e) => setMaxId(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 text-center" min="1" disabled={isRunning} />
                                        <Button variant="outline" size="icon" onClick={() => setMaxId(p => p + 1)} disabled={isRunning} className="cursor-pointer"><span className="sr-only">+</span>+</Button>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="list" className="mt-4 space-y-4">
                                {savedLists.length > 0 ? (
                                    <Card>
                                        <CardHeader className="p-3"><CardTitle className="text-sm">{t('all_lists_title')}</CardTitle></CardHeader>
                                        <CardContent className="p-0">
                                            <div className="max-h-56 overflow-y-auto border-t">
                                                {savedLists.map((list) => (
                                                    <div key={list.name} className="flex items-center gap-1 p-2 hover:bg-muted border-b last:border-b-0">
                                                        <Button variant={activeListName === list.name ? 'secondary' : 'ghost'} className="flex-1 justify-start cursor-pointer h-auto py-1 text-left" onClick={() => setActiveListName(list.name)}>
                                                            <div className="flex flex-col items-start"><span className="truncate max-w-[120px] sm:max-w-[150px]">{list.name}</span><span className="text-xs text-muted-foreground">{t('list_file_count', list.students.length)}</span></div>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => { setListToRename(list); setRenameInput(list.name); }}><Pencil className="h-4 w-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => handleExportList(list)}><Download className="h-4 w-4" /></Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="cursor-pointer shrink-0"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader><AlertDialogTitle>{t('delete_list_confirm_title')}</AlertDialogTitle><AlertDialogDescription>{t('delete_list_confirm_description', list.name)}</AlertDialogDescription></AlertDialogHeader>
                                                                <AlertDialogFooter><AlertDialogCancel>{t('cancel_button')}</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteList(list)} className="bg-destructive hover:bg-destructive/90">{t('delete_button')}</AlertDialogAction></AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-2 border-t"><Button variant="outline" className="w-full cursor-pointer" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />{t('import_new_list_button')}</Button></CardFooter>
                                    </Card>
                                ) : (
                                    <Button variant="outline" className="w-full border-dashed cursor-pointer h-24" onClick={() => fileInputRef.current?.click()} disabled={isRunning || isUploading}><div className="flex flex-col items-center gap-2"><Upload className="h-6 w-6" /><span>{t('import_first_list_button_text')}</span></div></Button>
                                )}
                                <Input type="file" ref={fileInputRef} className="hidden" accept=".txt" onChange={handleFileUpload} disabled={isRunning || isUploading} />
                            </TabsContent>
                        </Tabs>
                        <Card className="p-5"><div className="space-y-4"><div className="flex items-center justify-between"><Label htmlFor="instant-mode-large" className="flex items-center gap-3 cursor-pointer"><Zap className="h-5 w-5" />{t('instant_mode_label')}</Label><Switch id="instant-mode-large" checked={page.isInstant} onCheckedChange={setIsInstant} disabled={isRunning} className="cursor-pointer"/></div><div className="flex items-center justify-between"><Label htmlFor="no-repeat-mode-large" className="flex items-center gap-3 cursor-pointer"><Repeat className="h-5 w-5" />{t('no_repeat_mode_label')}</Label><Switch id="no-repeat-mode-large" checked={isNoRepeat} onCheckedChange={setIsNoRepeat} disabled={isRunning} className="cursor-pointer"/></div></div></Card>
                        {isNoRepeat && selectedHistory.length > 0 && <Card><CardHeader><CardTitle className="text-base">{t('history_label', selectedHistory.length, allItems.length)}</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">{selectedHistory.map((item, index) => <Badge key={index} variant="outline">{item}</Badge>)}</CardContent></Card>}
                    </CardContent>
                </Card>
            </main>
            <div className="fixed bottom-4 right-4 flex gap-2">
                <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}><DialogTrigger asChild><Button variant="ghost" size="icon" aria-label={t('roll_history')} className="cursor-pointer"><History className="h-5 w-5" /></Button></DialogTrigger><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>{t('roll_history')}</DialogTitle></DialogHeader><div className="max-h-[60vh] overflow-y-auto"><Table><TableHeader><TableRow><TableHead>{t('roll_history_name')}</TableHead><TableHead className="text-right">{t('roll_history_time')}</TableHead></TableRow></TableHeader><TableBody>{rollHistory.map((item, index) => (<TableRow key={index}><TableCell className="font-medium">{item.name}</TableCell><TableCell className="text-right">{item.time}</TableCell></TableRow>))}</TableBody></Table></div><DialogFooter><Button variant="outline" onClick={handleClearHistory} disabled={rollHistory.length === 0} className="cursor-pointer">{t('roll_history_clear')}</Button><DialogClose asChild><Button className="cursor-pointer">{t('close')}</Button></DialogClose></DialogFooter></DialogContent></Dialog>
                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}><DialogTrigger asChild><Button variant="ghost" size="icon" aria-label={t('settings')} className="cursor-pointer"><Settings className="h-5 w-5" /></Button></DialogTrigger><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>{t('settings')}</DialogTitle></DialogHeader><div className="space-y-6 px-4 py-4"><div className="space-y-2"><Label htmlFor="blacklist-large">{t('blacklist_label')}</Label><div className="flex gap-2"><Input id="blacklist-large" placeholder={t('blacklist_placeholder')} value={newBlacklistItem} onChange={(e) => setNewBlacklistItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddBlacklistItem()} /><Button onClick={handleAddBlacklistItem} className="cursor-pointer">{t('add_button')}</Button></div>{blacklist.length > 0 && (<div className="flex flex-wrap gap-2 pt-2">{blacklist.map(item => (<Badge key={item} variant="secondary" className="flex items-center gap-1">{item}<button onClick={() => handleRemoveBlacklistItem(item)} className="rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer"><X className="h-3 w-3" /></button></Badge>))}</div>)}</div><div className="flex items-center justify-between"><Label>{t('sound_effect_label')}</Label><Select value={soundEffect} onValueChange={(value: SoundEffect) => setSoundEffect(value)}><SelectTrigger className="w-[180px] cursor-pointer"><SelectValue placeholder={t('sound_effect_label')} /></SelectTrigger><SelectContent><SelectItem value="none" className="cursor-pointer">{t('sound_effect_none')}</SelectItem><SelectItem value="pop" className="cursor-pointer">{t('sound_effect_pop')}</SelectItem><SelectItem value="applause" className="cursor-pointer">{t('sound_effect_applause')}</SelectItem><SelectItem value="firework" className="cursor-pointer">{t('sound_effect_firework')}</SelectItem></SelectContent></Select></div><div className="flex items-center justify-between"><Label>{t('language')}</Label><Select value={language} onValueChange={(value: Language) => setLanguage(value)}><SelectTrigger className="w-[180px] cursor-pointer"><SelectValue placeholder={t('language')} /></SelectTrigger><SelectContent><SelectItem value="zh" className="cursor-pointer">{t('language_zh')}</SelectItem><SelectItem value="zh-TW" className="cursor-pointer">{t('language_zh_tw')}</SelectItem><SelectItem value="en" className="cursor-pointer">{t('language_en')}</SelectItem><SelectItem value="ja" className="cursor-pointer">{t('language_ja')}</SelectItem><SelectItem value="ko" className="cursor-pointer">{t('language_ko')}</SelectItem></SelectContent></Select></div><div className="space-y-2 pt-4 border-t"><Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer" onClick={handleShowGuide}><HelpCircle className="h-4 w-4" /> {t('show_guide')}</Button><Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer" onClick={() => handleShowLegalDoc('privacy')}><ShieldCheck className="h-4 w-4" /> {t('privacy_policy')}</Button><Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer" onClick={() => handleShowLegalDoc('terms')}><FileBadge className="h-4 w-4" /> {t('terms_of_service')}</Button></div><p className="text-xs text-muted-foreground text-center pt-4">v2.3.0 ({process.env.NEXT_PUBLIC_BUILD_ID?.slice(0, 7)})<br />{t('about_author')} aiwandiannaodelele/龚奕帆 <br /> {t('mit_license')}</p></div></DialogContent></Dialog>
            </div>
        </div>
    );
};
