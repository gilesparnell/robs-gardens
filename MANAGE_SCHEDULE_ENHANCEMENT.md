# ManageSchedule Page Enhancements

**Features to Add:**
1. Autocomplete for suburbs/areas as you type
2. Interactive map selection
3. Visual area selection feedback

---

## Design Option 1: Map Modal (RECOMMENDED)

**Pros:** Clean, doesn't clutter the page, focused UX
**Cons:** Extra click to open modal

### User Flow
```
1. User clicks "Select from Map" button next to area input
2. Modal opens with NSW map
3. Map shows all service areas, color-coded by service day
4. User clicks on area
5. Modal closes, area + postcode auto-populate
```

### Visual Layout
```
┌─────────────────────────────────────────────┐
│ Manage Schedule                         [X] │
├─────────────────────────────────────────────┤
│                                             │
│ Monday                                      │
│ ┌─────────────────────────────────────────┐│
│ │ Postcodes: [2101] [2102] [2103]    [+]  ││
│ │ Areas: [Elanora Heights] [Narrabeen][+] ││
│ │         Type area... [Select from Map] ││
│ └─────────────────────────────────────────┘│
│                                             │
└─────────────────────────────────────────────┘

When "Select from Map" clicked:
┌──────────────────────────────────────────────┐
│ Select Service Area from Map            [X]  │
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │                                        │ │
│  │    🗺️ NSW Service Map                 │ │
│  │    (Interactive Leaflet Map)          │ │
│  │                                        │ │
│  │  🔵 Monday areas                      │ │
│  │  🟢 Tuesday areas                     │ │
│  │  🟡 Wednesday areas                   │ │
│  │  🔴 Thursday areas                    │ │
│  │  🟣 Friday areas                      │ │
│  │                                        │ │
│  │ [Click on any area to select]         │ │
│  └────────────────────────────────────────┘ │
│                                              │
│ Selected: Elanora Heights (Postcode: 2101) │
│                                              │
│                              [Cancel] [Add] │
└──────────────────────────────────────────────┘
```

---

## Design Option 2: Hybrid with Sidebar Map

**Pros:** Always visible, real-time preview
**Cons:** Takes up screen space, more complex layout

### Visual Layout
```
┌─────────────────────────────────────────────┐
│ Manage Schedule                             │
├──────────────────────────┬──────────────────┤
│ Left: Form               │ Right: Map       │
│                          │                  │
│ Monday                   │  ┌────────────┐ │
│ Postcodes: [+]           │  │   NSW Map  │ │
│ Type... [▼ autocomplete] │  │            │ │
│          Elanora Heights │  │  🔵 Monday │ │
│          Narrabeen       │  │  🟢 Tuesday│ │
│          Frenchs Forest  │  │  🟡 Weds  │ │
│                          │  │            │ │
│ Areas: [+]               │  │ [Click to  │ │
│ Type... [▼ autocomplete] │  │  select]   │ │
│          [No areas yet]  │  │            │ │
│                          │  │            │ │
│                          │  └────────────┘ │
│                          │                  │
└──────────────────────────┴──────────────────┘
```

---

## Design Option 3: Autocomplete with Quick Buttons

**Pros:** Minimal UI change, smooth UX
**Cons:** May need multiple interactions

### Visual Layout
```
Postcodes: [2101] [2102] [▲]
Type: [e________] 🗺️
      ├─ Elanora Heights
      ├─ Engadine
      ├─ Enfield
      └─ Ettalong

(As you type, suggestions appear. 🗺️ button opens map)
```

---

## RECOMMENDED: Hybrid Approach

**Combine:**
1. **Autocomplete dropdown** for quick selection while typing
2. **"Select from Map" button** for visual/geographic selection
3. **Search within autocomplete** to filter by suburb name

### Implementation Components

```
├── Features
│   ├── 1. Autocomplete Dropdown
│   │   ├── Auto-trigger on 3+ characters
│   │   ├── Filter by substring match (case-insensitive)
│   │   ├── Keyboard navigation (arrow keys, enter)
│   │   ├── Click to select
│   │   └── Show postcode alongside suburb
│   │
│   ├── 2. Map Modal
│   │   ├── Interactive NSW map (Leaflet.js)
│   │   ├── Color-coded areas by service day
│   │   ├── Hover tooltips (suburb name, postcode)
│   │   ├── Click to select
│   │   ├── Zoom to region
│   │   └── Legend showing day → color mapping
│   │
│   └── 3. Integration
│       ├── Selecting from dropdown updates form
│       ├── Selecting from map updates form
│       ├── Both sync postcode + area fields
│       └── Visual feedback (check mark, highlight)
```

---

## Implementation Plan

### Step 1: Create Autocomplete Hook

```typescript
// hooks/useSuburbAutocomplete.ts
function useSuburbAutocomplete(query: string) {
  const results = useMemo(() => {
    if (query.length < 2) return [];

    const lower = query.toLowerCase();
    return Object.entries(AU_POSTCODE_MAP)
      .flatMap(([pc, suburbs]) =>
        suburbs
          .filter(s => s.toLowerCase().includes(lower))
          .map(s => ({ suburb: s, postcode: pc }))
      )
      .slice(0, 10); // Limit to 10 results
  }, [query]);

  return results;
}
```

### Step 2: Create Autocomplete Component

```typescript
// components/SuburbAutocomplete.tsx
interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suburb: string, postcode: string) => void;
  placeholder?: string;
}

export function SuburbAutocomplete(props: Props) {
  const [open, setOpen] = useState(false);
  const results = useSuburbAutocomplete(props.value);

  return (
    <div className="relative">
      <input
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={props.placeholder}
        className="..."
      />

      {open && results.length > 0 && (
        <div className="absolute top-full w-full bg-white border rounded shadow-lg z-10">
          {results.map(({ suburb, postcode }) => (
            <button
              key={`${suburb}-${postcode}`}
              onClick={() => {
                props.onSelect(suburb, postcode);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-primary/10"
            >
              <span className="font-medium">{suburb}</span>
              <span className="text-sm text-muted-foreground ml-2">
                {postcode}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Step 3: Create Map Modal Component

```typescript
// components/SelectAreaMap.tsx
import L from 'leaflet';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (suburb: string, postcode: string) => void;
  schedule: Zone[];
}

export function SelectAreaMap(props: Props) {
  const [selected, setSelected] = useState<{suburb: string, postcode: string} | null>(null);

  if (!props.open) return null;

  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Service Area from Map</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Map */}
          <div className="md:col-span-2">
            <MapComponent schedule={props.schedule} onSelect={setSelected} />
          </div>

          {/* Legend & Selection */}
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded">
              <h4 className="font-semibold mb-2">Service Days</h4>
              <div className="space-y-1 text-sm">
                <div><span className="inline-block w-3 h-3 bg-blue-500 mr-2 rounded"></span>Monday</div>
                <div><span className="inline-block w-3 h-3 bg-green-500 mr-2 rounded"></span>Tuesday</div>
                <div><span className="inline-block w-3 h-3 bg-yellow-500 mr-2 rounded"></span>Wednesday</div>
                <div><span className="inline-block w-3 h-3 bg-red-500 mr-2 rounded"></span>Thursday</div>
                <div><span className="inline-block w-3 h-3 bg-purple-500 mr-2 rounded"></span>Friday</div>
              </div>
            </div>

            {selected && (
              <div className="bg-primary/10 p-4 rounded">
                <p className="text-sm text-muted-foreground">Selected:</p>
                <p className="font-semibold">{selected.suburb}</p>
                <p className="text-sm text-muted-foreground">Postcode: {selected.postcode}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={props.onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (selected) {
                props.onSelect(selected.suburb, selected.postcode);
                props.onClose();
              }
            }}
            disabled={!selected}
          >
            Add Area
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MapComponent(props: {schedule: Zone[], onSelect: (s: any) => void}) {
  const mapRef = useRef<L.Map>();

  useEffect(() => {
    // Initialize Leaflet map centered on Sydney
    const map = L.map(mapRef.current!).setView([-33.8688, 151.2093], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Add markers/polygons for each service area
    const colors: Record<string, string> = {
      'Monday': '#3b82f6',
      'Tuesday': '#22c55e',
      'Wednesday': '#eab308',
      'Thursday': '#ef4444',
      'Friday': '#a855f7',
    };

    props.schedule.forEach(zone => {
      zone.areas.forEach(area => {
        // Add marker/circle for each area
        L.circleMarker([/* lat, lng */], {
          color: colors[zone.day],
          radius: 10,
        }).bindPopup(`${area} (${zone.day})`).on('click', () => {
          props.onSelect({suburb: area, postcode: zone.postcodes[0]});
        }).addTo(map);
      });
    });

    mapRef.current = map;
  }, []);

  return <div ref={mapRef} className="w-full h-96 rounded border" />;
}
```

### Step 4: Update ManageSchedule Component

```typescript
// In the Area input section:
<div className="flex gap-2">
  <SuburbAutocomplete
    value={areaInput[index]}
    onChange={v => setAreaInput(/* ... */)}
    onSelect={(suburb, postcode) => handleAddArea(index, suburb, postcode)}
    placeholder="Type suburb name or select from map..."
  />
  <Button
    variant="outline"
    size="icon"
    onClick={() => setMapOpen(true)}
    title="Select from map"
  >
    <MapIcon className="w-4 h-4" />
  </Button>
</div>

<SelectAreaMap
  open={mapOpen}
  onClose={() => setMapOpen(false)}
  onSelect={(suburb, postcode) => handleAddArea(index, suburb, postcode)}
  schedule={schedule}
/>
```

---

## Technology Stack

### Dependencies to Add
```bash
npm install leaflet @types/leaflet
# OR
npm install react-map-gl  # More React-friendly alternative
```

### Libraries Comparison

| Library | Size | React | GIS | Recommendation |
|---------|------|-------|-----|---|
| Leaflet.js | 40KB | Needs wrapper | Good | ✅ Best for simple maps |
| react-map-gl | 50KB | Native | Excellent | Alternative |
| Google Maps | Large | Yes | Excellent | If using Google ecosystem |

**Recommendation:** Use Leaflet.js + react-leaflet for lightweight, simple map interaction.

---

## User Experience Flow

### Scenario 1: Using Autocomplete
```
1. User types "nar" in area field
2. Dropdown shows:
   - Narrabeen (2101)
   - Narellan (2567)
   - Narwee (2209)
3. User clicks "Narrabeen (2101)"
4. Area field populated with "Narrabeen"
5. Postcode field auto-updated to "2101"
6. Click [+] to add to zone
```

### Scenario 2: Using Map
```
1. User clicks 🗺️ button
2. Map modal opens with Sydney map
3. Areas color-coded by service day (Monday=blue, Tuesday=green, etc.)
4. User hovers over an area → tooltip shows "Narrabeen (Monday, 2101)"
5. User clicks → area highlights, "Narrabeen (2101)" shown in selection panel
6. User clicks [Add Area] → modal closes, area + postcode added to zone
```

---

## Benefits

✅ **Faster data entry** - Type to autocomplete instead of remembering postcodes
✅ **Visual selection** - See all areas on map, understand geography
✅ **Error reduction** - No mistyped suburb names
✅ **Geographic accuracy** - Map ensures correct area selection
✅ **Mobile friendly** - Autocomplete works on mobile, map is responsive
✅ **Accessible** - Keyboard navigation in dropdown, tab through map

---

## Implementation Priority

1. **Phase 1 (MVP):** Autocomplete dropdown
   - Estimated: 2-3 hours
   - High impact, minimal dependencies
   - Can be added immediately

2. **Phase 2 (Enhancement):** Map modal
   - Estimated: 4-5 hours
   - Nice-to-have, more complex
   - Can be added later

---

## Code Estimates

| Component | Lines | Complexity | Time |
|-----------|-------|-----------|------|
| Autocomplete Hook | 20-30 | Low | 30 min |
| Autocomplete Component | 60-80 | Low | 1 hour |
| Map Modal | 150-200 | Medium | 2-3 hours |
| Integration in ManageSchedule | 30-40 | Low | 30 min |
| **Total** | ~300-350 | - | **4-5 hours** |

---

## Recommended Approach

**Start with Phase 1 (Autocomplete):**
1. Quick to implement
2. Immediate UX improvement
3. No complex dependencies
4. Can test with existing data

**Then add Phase 2 (Map) if desired:**
1. More sophisticated UX
2. Better for visual learners
3. Helps users understand service areas geographically

---

## Sample Data Structure for Map

```typescript
// Generate coordinates for each area
const areaCoordinates: Record<string, [number, number]> = {
  'Elanora Heights': [-33.7542, 151.3024],
  'Narrabeen': [-33.7283, 151.2885],
  'Frenchs Forest': [-33.7459, 151.2511],
  'Chatswood': [-33.7969, 151.1884],
  // ... etc
};

// Or query a GeoJSON file for suburb boundaries
// GeoJSON of NSW suburbs available from data.gov.au
```

---

## Next Steps

1. Choose implementation approach (recommend Phases 1 + 2)
2. Add Leaflet.js to dependencies
3. Create hooks and components
4. Integrate into ManageSchedule
5. Test with real data
6. Deploy to production

Would you like me to proceed with implementation?
