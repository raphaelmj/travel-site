import { Attraction } from './attraction';

export interface City {
    id: number;
    name: string;
    attractions?: Attraction[];
    image?: string;
    description?: string;
    lat: number;
    lng: number;
}