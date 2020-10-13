import { Attraction } from './attraction';

export interface City {
  id?: number;
  name: string;
  alias?: string | null
  attractions?: Attraction[];
  image?: string | null;
  description?: string | null;
  lat: number;
  lng: number;
  regionId?: number | null
  added?: boolean
}
