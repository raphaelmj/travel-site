import { City } from './city';
import { Attraction } from './attraction';

export interface Region {
  id?: number;
  name: string;
  alias: string | null
  cities?: City[];
  attractions?: Attraction[]
  regionAttractions?: Attraction[]
  lat?: number;
  lng?: number;
  added?: boolean
}
