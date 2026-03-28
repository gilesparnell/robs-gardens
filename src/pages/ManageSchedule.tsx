import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, ArrowLeft, Plus, Trash2, MapPin, Calendar, X, HelpCircle, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import initialZones from '../../data/zones.json';
import { AU_POSTCODE_MAP, SUBURB_TO_POSTCODE } from '../lib/postcodeData';
import { SuburbAutocomplete } from '@/components/SuburbAutocomplete';
import { SelectAreaMap } from '@/components/SelectAreaMap';

import type { Zone, RotatingSchedule } from '../../types/schedule';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export default function ManageSchedule() {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState<RotatingSchedule>({
        weeks: [{ week: 1, zones: [] }, { week: 2, zones: [] }],
        anchorDate: new Date().toISOString().split('T')[0],
    });
    const [activeWeek, setActiveWeek] = useState<1 | 2>(1);
    const [isSaving, setIsSaving] = useState(false);
    const [pcInput, setPcInput] = useState<string[]>([]);
    const [areaInput, setAreaInput] = useState<string[]>([]);
    const [mapOpen, setMapOpen] = useState(false);
    const [showHelp, setShowHelp] = useState(true);

    useEffect(() => {
        const data = initialZones as RotatingSchedule;
        setSchedule(data);
        const zones = data.weeks[0].zones;
        setPcInput(new Array(zones.length).fill(''));
        setAreaInput(new Array(zones.length).fill(''));
    }, []);

    // Current week's zones
    const currentZones = schedule.weeks[activeWeek - 1].zones;

    const setCurrentZones = (zones: Zone[]) => {
        setSchedule(prev => {
            const newWeeks = [...prev.weeks] as [typeof prev.weeks[0], typeof prev.weeks[1]];
            newWeeks[activeWeek - 1] = { ...newWeeks[activeWeek - 1], zones };
            return { ...prev, weeks: newWeeks };
        });
    };

    // Reset inputs when switching weeks
    useEffect(() => {
        setPcInput(new Array(currentZones.length).fill(''));
        setAreaInput(new Array(currentZones.length).fill(''));
    }, [activeWeek, currentZones.length]);

    const syncPostcodesToAreas = (postcodes: string[]) => {
        const areas = new Set<string>();
        postcodes.forEach(pc => {
            const suburbs = AU_POSTCODE_MAP[pc];
            if (suburbs) suburbs.forEach(s => areas.add(s));
        });
        return Array.from(areas);
    };

    const syncAreasToPostcodes = (areas: string[]) => {
        const postcodes = new Set<string>();
        areas.forEach(area => {
            const pc = SUBURB_TO_POSTCODE[area.toLowerCase()];
            if (pc) postcodes.add(pc);
        });
        return Array.from(postcodes);
    };

    const handleAddPostcode = (index: number, pc: string) => {
        if (!pc) return;
        const newZones = [...currentZones];
        const currentPcs = new Set(newZones[index].postcodes);
        currentPcs.add(pc);
        const updatedPcs = Array.from(currentPcs);
        newZones[index] = { ...newZones[index], postcodes: updatedPcs, areas: syncPostcodesToAreas(updatedPcs) };
        setCurrentZones(newZones);

        const newPcInput = [...pcInput];
        newPcInput[index] = '';
        setPcInput(newPcInput);
    };

    const handleAddArea = (index: number, area: string, postcode?: string) => {
        if (!area) return;
        const newZones = [...currentZones];
        const currentAreas = new Set(newZones[index].areas);
        currentAreas.add(area);
        const updatedAreas = Array.from(currentAreas);

        if (postcode) {
            const currentPcs = new Set(newZones[index].postcodes);
            currentPcs.add(postcode);
            newZones[index] = { ...newZones[index], areas: updatedAreas, postcodes: Array.from(currentPcs) };
        } else {
            newZones[index] = { ...newZones[index], areas: updatedAreas, postcodes: syncAreasToPostcodes(updatedAreas) };
        }

        setCurrentZones(newZones);

        const newAreaInput = [...areaInput];
        newAreaInput[index] = '';
        setAreaInput(newAreaInput);
    };

    const handleRemovePostcode = (index: number, pc: string) => {
        const newZones = [...currentZones];
        const updatedPcs = newZones[index].postcodes.filter(p => p !== pc);
        newZones[index] = { ...newZones[index], postcodes: updatedPcs, areas: syncPostcodesToAreas(updatedPcs) };
        setCurrentZones(newZones);
    };

    const handleRemoveArea = (index: number, area: string) => {
        const newZones = [...currentZones];
        const updatedAreas = newZones[index].areas.filter(a => a !== area);
        newZones[index] = { ...newZones[index], areas: updatedAreas, postcodes: syncAreasToPostcodes(updatedAreas) };
        setCurrentZones(newZones);
    };

    const handleUpdateField = (index: number, field: 'day' | 'label', value: string) => {
        const newZones = [...currentZones];
        newZones[index] = { ...newZones[index], [field]: value };
        setCurrentZones(newZones);
    };

    const handleAddZone = () => {
        setCurrentZones([...currentZones, { day: 'Monday', postcodes: [], areas: [], label: 'New Zone' }]);
        setPcInput([...pcInput, '']);
        setAreaInput([...areaInput, '']);
    };

    const handleRemoveZone = (index: number) => {
        setCurrentZones(currentZones.filter((_, i) => i !== index));
        setPcInput(pcInput.filter((_, i) => i !== index));
        setAreaInput(areaInput.filter((_, i) => i !== index));
    };

    const handleCopyWeek = () => {
        const sourceWeek = activeWeek;
        const targetWeek = sourceWeek === 1 ? 2 : 1;
        const sourceZones = schedule.weeks[sourceWeek - 1].zones;

        setSchedule(prev => {
            const newWeeks = [...prev.weeks] as [typeof prev.weeks[0], typeof prev.weeks[1]];
            newWeeks[targetWeek - 1] = {
                ...newWeeks[targetWeek - 1],
                zones: JSON.parse(JSON.stringify(sourceZones)),
            };
            return { ...prev, weeks: newWeeks };
        });

        toast.success(`Week ${sourceWeek} copied to Week ${targetWeek}`);
    };

    const handleAnchorDateChange = (date: string) => {
        setSchedule(prev => ({ ...prev, anchorDate: date }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/save-schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schedule }),
            });
            if (!response.ok) throw new Error('Failed to save');
            toast.success('Schedule updated successfully!');
            setTimeout(() => navigate('/'), 1000);
        } catch (error) {
            toast.error('Failed to save schedule. Please try again or call support.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-3xl font-serif font-bold">Manage Schedule</h1>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleSave} disabled={isSaving} className="gap-2 shadow-lg px-8">
                            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save All Changes'}
                        </Button>
                    </div>
                </div>

                {/* Help Section */}
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 rounded-lg border border-blue-200 bg-blue-50 overflow-hidden"
                    >
                        <button
                            onClick={() => setShowHelp(false)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-blue-600" />
                                <div className="text-sm font-medium text-blue-900">How to build your 2-week schedule</div>
                            </div>
                            <X className="w-4 h-4 text-blue-600" />
                        </button>
                        <div className="px-4 pb-4 space-y-2 text-sm text-blue-800">
                            <p className="font-medium">Your schedule rotates on a 2-week cycle:</p>
                            <ul className="space-y-1 ml-4">
                                <li>Use the <span className="font-medium">Week 1 / Week 2</span> tabs to configure each week separately</li>
                                <li>Set the <span className="font-medium">Week 1 Start Date</span> to a Monday — the schedule alternates from there</li>
                                <li>Use <span className="font-medium">Copy to Week</span> to duplicate one week's setup to the other</li>
                            </ul>
                        </div>
                    </motion.div>
                )}

                {/* Anchor Date + Week Tabs */}
                <div className="mb-8 space-y-4">
                    {/* Anchor Date Picker */}
                    <div className="flex items-center gap-4 bg-card rounded-xl border border-border p-4">
                        <Calendar className="w-5 h-5 text-primary shrink-0" />
                        <div className="flex-1">
                            <Label className="text-sm font-medium">Week 1 Start Date</Label>
                            <p className="text-xs text-muted-foreground">Pick a Monday. The schedule alternates every 2 weeks from this date.</p>
                        </div>
                        <Input
                            type="date"
                            value={schedule.anchorDate}
                            onChange={(e) => handleAnchorDateChange(e.target.value)}
                            className="w-44"
                        />
                    </div>

                    {/* Week Tabs */}
                    <div className="flex items-center gap-3">
                        <div className="flex bg-muted rounded-xl p-1">
                            {([1, 2] as const).map((week) => (
                                <button
                                    key={week}
                                    onClick={() => setActiveWeek(week)}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        activeWeek === week
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    Week {week}
                                    <span className="ml-2 text-xs opacity-70">
                                        ({schedule.weeks[week - 1].zones.length} days)
                                    </span>
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyWeek}
                            className="gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            Copy to Week {activeWeek === 1 ? 2 : 1}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-8">
                    {currentZones.map((zone, index) => (
                        <motion.div
                            key={`w${activeWeek}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="border-border shadow-soft overflow-hidden">
                                <div className="bg-primary/5 px-6 py-4 flex items-center justify-between border-b border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-lg leading-none">{zone.day}</h2>
                                            <p className="text-xs text-muted-foreground mt-1">{zone.label || 'No Name Set'} — Week {activeWeek}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveZone(index)}
                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <CardContent className="p-6">
                                    <div className="grid lg:grid-cols-2 gap-8">
                                        {/* Left Column: Basic Info */}
                                        <div className="space-y-6">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Service Day</Label>
                                                    <select
                                                        className="w-full flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                        value={zone.day}
                                                        onChange={(e) => handleUpdateField(index, 'day', e.target.value)}
                                                    >
                                                        {DAYS.map(day => (
                                                            <option key={day} value={day}>{day}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Zone Name</Label>
                                                    <Input
                                                        value={zone.label}
                                                        onChange={(e) => handleUpdateField(index, 'label', e.target.value)}
                                                        placeholder="e.g. Northern Beaches"
                                                        className="rounded-lg"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    Postcodes
                                                </Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Add postcode (e.g. 2101)"
                                                        value={pcInput[index] || ''}
                                                        onChange={(e) => {
                                                            const v = [...pcInput];
                                                            v[index] = e.target.value;
                                                            setPcInput(v);
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleAddPostcode(index, pcInput[index]);
                                                        }}
                                                        className="rounded-lg"
                                                    />
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => handleAddPostcode(index, pcInput[index])}
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-muted/30 rounded-xl border border-dashed">
                                                    <AnimatePresence>
                                                        {zone.postcodes.length > 0 ? (
                                                            zone.postcodes.map(pc => (
                                                                <motion.div key={pc} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                                                    <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 text-sm bg-background border-border shadow-sm">
                                                                        {pc}
                                                                        <button
                                                                            onClick={() => handleRemovePostcode(index, pc)}
                                                                            className="hover:bg-muted p-0.5 rounded-full transition-colors"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    </Badge>
                                                                </motion.div>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">No postcodes added</span>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Suburbs */}
                                        <div className="space-y-4">
                                            <Label className="flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-primary" />
                                                Suburbs & Areas
                                            </Label>
                                            <SuburbAutocomplete
                                                value={areaInput[index] || ''}
                                                onChange={(v) => {
                                                    const newInput = [...areaInput];
                                                    newInput[index] = v;
                                                    setAreaInput(newInput);
                                                }}
                                                onSelect={(suburb, postcode) => {
                                                    handleAddArea(index, suburb, postcode);
                                                }}
                                                onMapClick={() => {
                                                    setMapOpen(true);
                                                }}
                                                placeholder="Type suburb name or select from map..."
                                                className="w-full"
                                            />
                                            <div className="flex flex-wrap gap-2 min-h-[140px] p-4 bg-primary/5 rounded-xl border border-primary/10 content-start">
                                                <AnimatePresence>
                                                    {zone.areas.length > 0 ? (
                                                        zone.areas.map(area => (
                                                            <motion.div key={area} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                                                                <Badge variant="outline" className="pl-3 pr-1 py-1 gap-1 text-sm bg-background/80 backdrop-blur-sm border-primary/20">
                                                                    {area}
                                                                    <button
                                                                        onClick={() => handleRemoveArea(index, area)}
                                                                        className="hover:bg-primary/10 p-0.5 rounded-full transition-colors"
                                                                    >
                                                                        <X className="w-3 h-3 text-primary" />
                                                                    </button>
                                                                </Badge>
                                                            </motion.div>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">Areas will appear here automatically when you add postcodes</span>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    <Button
                        variant="outline"
                        onClick={handleAddZone}
                        className="w-full py-12 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 gap-3 rounded-2xl bg-white"
                    >
                        <Plus className="w-6 h-6 text-primary" />
                        <span className="text-lg font-medium text-foreground">Add New Service Day (Week {activeWeek})</span>
                    </Button>
                </div>

                {/* Area Selection Map Modal */}
                {mapOpen && (
                    <SelectAreaMap
                        open={mapOpen}
                        onClose={() => {
                            setMapOpen(false);
                        }}
                        onSaveSelections={(savedSelections) => {
                            const newZones = currentZones.map(zone => {
                                const areasForDay = savedSelections.get(zone.day);
                                if (areasForDay && areasForDay.length > 0) {
                                    const currentAreas = new Set(zone.areas);
                                    const currentPcs = new Set(zone.postcodes);

                                    areasForDay.forEach(area => {
                                        currentAreas.add(area.suburb);
                                        if (area.postcode) currentPcs.add(area.postcode);
                                    });

                                    return {
                                        ...zone,
                                        areas: Array.from(currentAreas),
                                        postcodes: Array.from(currentPcs)
                                    };
                                }
                                return zone;
                            });

                            setCurrentZones(newZones);
                            setMapOpen(false);
                        }}
                        schedule={currentZones}
                    />
                )}
            </div>
        </div>
    );
}

// Local Sparkles icon (matches lucide style)
function Sparkles(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}
