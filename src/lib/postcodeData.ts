export const AU_POSTCODE_MAP: Record<string, string[]> = {
    "2060": ["North Sydney", "McMahons Point", "Waverton"],
    "2061": ["Kirribilli", "Milsons Point"],
    "2062": ["Cammeray"],
    "2063": ["Northbridge"],
    "2064": ["Artarmon"],
    "2065": ["Crows Nest", "Greenwich", "St Leonards", "Wollstonecraft"],
    "2066": ["Lane Cove", "Lane Cove North", "Lane Cove West", "Linley Point", "Longueville", "Northwood", "Riverview"],
    "2067": ["Chatswood", "Chatswood West"],
    "2068": ["Castlecrag", "Middle Cove", "Willoughby", "Willoughby North"],
    "2069": ["Castle Cove", "Roseville", "Roseville Chase"],
    "2070": ["Lindfield", "East Lindfield"],
    "2071": ["Killara", "East Killara"],
    "2072": ["Gordon"],
    "2073": ["Pymble", "West Pymble"],
    "2074": ["Turramurra", "North Turramurra", "South Turramurra", "Warrawee"],
    "2075": ["St Ives", "St Ives Chase"],
    "2076": ["Normanhurst", "Wahroonga", "North Wahroonga"],
    "2077": ["Asquith", "Hornsby", "Hornsby Heights", "Waitara"],
    "2085": ["Belrose", "Davidson"],
    "2086": ["Frenchs Forest", "Frenchs Forest East"],
    "2087": ["Forestville", "Killarney Heights"],
    "2088": ["Mosman"],
    "2089": ["Kurraba Point", "Neutral Bay"],
    "2090": ["Cremorne", "Cremorne Point"],
    "2092": ["Seaforth"],
    "2093": ["Balgowlah", "Balgowlah Heights", "North Balgowlah", "Clontarf", "Manly Vale"],
    "2094": ["Fairlight"],
    "2095": ["Manly"],
    "2096": ["Curl Curl", "North Curl Curl", "Freshwater", "Queenscliff"],
    "2097": ["Collaroy", "Collaroy Plateau", "Wheeler Heights"],
    "2099": ["Cromer", "Dee Why", "Narraweena"],
    "2100": ["Allambie Heights", "Beacon Hill", "Brookvale", "North Manly", "Oxford Falls"],
    "2101": ["Elanora Heights", "Narrabeen", "North Narrabeen"],
    "2102": ["Warriewood"],
    "2103": ["Mona Vale"],
    "2104": ["Bayview"],
    "2105": ["Church Point", "Scotland Island", "Lovett Bay", "McCarrs Creek", "Morning Bay", "Elvina Bay"],
    "2106": ["Newport"],
    "2107": ["Avalon Beach", "Bilgola Beach", "Bilgola Plateau", "Clareville", "Whale Beach"],
    "2108": ["Coasters Retreat", "Currawong Beach", "Great Mackerel Beach", "Palm Beach"]
};

// Inverse map for suburb -> postcode lookup
export const SUBURB_TO_POSTCODE: Record<string, string> = {};
Object.entries(AU_POSTCODE_MAP).forEach(([postcode, suburbs]) => {
    suburbs.forEach(suburb => {
        SUBURB_TO_POSTCODE[suburb.toLowerCase()] = postcode;
    });
});
