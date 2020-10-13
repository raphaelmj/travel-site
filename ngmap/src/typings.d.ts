interface Attraction {
  id: number;
  name: string;
  attractionType: string;
  image?: string;
  description?: string;
  lat: number;
  lng: number;
}

interface City {
  id: number;
  name: string;
  attractions?: Attraction[];
  image?: string;
  description?: string;
  lat: number;
  lng: number;
}

export interface Catalog {
  id: number | string | '';
  name: string;
  alias: string;
  current: boolean;
}

declare var cities: City[];
declare var attractions: Attraction[];
declare var catalog: Catalog | null
