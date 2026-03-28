export type AreaPostcode = {
  area: string;
  postcode: string;
};

export type Zone = {
  day: string;
  postcodes: string[];
  areas: string[];
  areaPostcodes?: AreaPostcode[];
  label: string;
};

export type WeekSchedule = {
  week: 1 | 2;
  zones: Zone[];
};

export type RotatingSchedule = {
  weeks: WeekSchedule[];
  /** ISO date string of a known Week 1 Monday — the epoch anchor */
  anchorDate: string;
};
