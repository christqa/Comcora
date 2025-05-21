export type Position = {
  lat: number;
  lng: number;
};

export type LocationInfo = {
  title: string;
  location: string;
  timeClosed: string;
  distance: string;
  unit: string;
  position: Position;
  startWeekDay?: string;
  endWeekDay?: string;
  startHour?: string;
  endHour?: string;
  telephone?: string;
  website?: string;
  id?: number;
};
