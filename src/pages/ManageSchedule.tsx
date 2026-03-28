import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, ArrowLeft, Plus, Trash2, MapPin, Calendar, X, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import initialZones from '../../data/zones.json';
import { AU_POSTCODE_MAP, SUBURB_TO_POSTCODE } from '../lib/postcodeData';
import { SuburbAutocomplete } from '@/components/SuburbAutocomplete';
import { SelectAreaMap } from '@/components/SelectAreaMap';

type Zone = {
    day: string;
    postcodes: string[];
    areas: string[];
    label: string;
};

type ZonesData = {
    schedule: Zone[];
};

export default function ManageSchedule() {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState<Zone[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [pcInput, setPcInput] = useState<string[]>([]);
    const [areaInput, setAreaInput] = useState<string[]>([]);
    const [mapOpen, setMapOpen] = useState(false);
    const [showHelp, setShowHelp] = useState(true);

    useEffect(() => {
        const data = initialZones as ZonesData;
        setSchedule(data.schedule);
        setPcInput(new Array(data.schedule.length).fill(''));
        setAreaInput(new Array(data.schedule.length).fill(''));
    }, []);

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
        const newSchedule = [...schedule];
        const currentPcs = new Set(newSchedule[index].postcodes);
        currentPcs.add(pc);
        const updatedPcs = Array.from(currentPcs);
        newSchedule[index].postcodes = updatedPcs;
        newSchedule[index].areas = syncPostcodesToAreas(updatedPcs);
        setSchedule(newSchedule);

        const newPcInput = [...pcInput];
        newPcInput[index] = '';
        setPcInput(newPcInput);
    };

    const handleAddArea = (index: number, area: string, postcode?: string) => {
        if (!area) return;
        const newSchedule = [...schedule];
        const currentAreas = new Set(newSchedule[index].areas);
        currentAreas.add(area);
        const updatedAreas = Array.from(currentAreas);
        newSchedule[index].areas = updatedAreas;

        // If postcode provided (from map or autocomplete), add it directly
        // Otherwise, sync from areas
        if (postcode) {
            const currentPcs = new Set(newSchedule[index].postcodes);
            currentPcs.add(postcode);
            newSchedule[index].postcodes = Array.from(currentPcs);
        } else {
            newSchedule[index].postcodes = syncAreasToPostcodes(updatedAreas);
        }

        setSchedule(newSchedule);

        const newAreaInput = [...areaInput];
        newAreaInput[index] = '';
        setAreaInput(newAreaInput);
    };

    const handleRemovePostcode = (index: number, pc: string) => {
        const newSchedule = [...schedule];
        const updatedPcs = newSchedule[index].postcodes.filter(p => p !== pc);
        newSchedule[index].postcodes = updatedPcs;
        newSchedule[index].areas = syncPostcodesToAreas(updatedPcs);
        setSchedule(newSchedule);
    };

    const handleRemoveArea = (index: number, area: string) => {
        const newSchedule = [...schedule];
        const updatedAreas = newSchedule[index].areas.filter(a => a !== area);
        newSchedule[index].areas = updatedAreas;
        newSchedule[index].postcodes = syncAreasToPostcodes(updatedAreas);
        setSchedule(newSchedule);
    };

    const handleUpdateField = (index: number, field: 'day' | 'label', value: string) => {
        const newSchedule = [...schedule];
        newSchedule[index][field] = value;
        setSchedule(newSchedule);
    };

    const handleAddZone = () => {
        setSchedule([...schedule, { day: 'Monday', postcodes: [], areas: [], label: 'New Zone' }]);
        setPcInput([...pcInput, '']);
        setAreaInput([...areaInput, '']);
    };

    const handleRemoveZone = (index: number) => {
        setSchedule(schedule.filter((_, i) => i !== index));
        setPcInput(pcInput.filter((_, i) => i !== index));
        setAreaInput(areaInput.filter((_, i) => i !== index));
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
                                <div className="text-sm font-medium text-blue-900">How to build your schedule</div>
                            </div>
                            <X className="w-4 h-4 text-blue-600" />
                        </button>
                        <div className="px-4 pb-4 space-y-2 text-sm text-blue-800">
                            <p className="font-medium">Two ways to add service areas for each day:</p>
                            <ul className="space-y-1 ml-4">
                                <li>📍 <span className="font-medium">Postcodes</span> – Enter specific postcodes (e.g. 2101, 2102)</li>
                                <li>🗺️ <span className="font-medium">Interactive Map</span> – Click the map icon and zoom into any area across Australia. Click dots to select suburbs and postcodes.</li>
                            </ul>
                            <p className="text-xs text-blue-700 mt-2">Your service area copy will automatically update across the website based on your selections.</p>
                        </div>
                    </motion.div>
                )}


                <div className="grid gap-8">
                    {schedule.map((zone, index) => (
                        <motion.div
                            key={index}
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
                                            <p className="text-xs text-muted-foreground mt-1">{zone.label || 'No Name Set'}</p>
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
                                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
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
                        <span className="text-lg font-medium text-foreground">Add New Service Day</span>
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
                            // Apply all accumulated selections to schedule
                            const newSchedule = schedule.map(zone => {
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

                            setSchedule(newSchedule);
                            setMapOpen(false);
                        }}
                        schedule={schedule}
                    />
                )}
            </div>
        </div>
    );
}

// Add local icon import we missed in types
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
