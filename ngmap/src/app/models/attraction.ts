export interface Attraction {
    id: number;
    name: string;
    attractionType: string;
    image?: string;
    description?: string;
    lat: number;
    lng: number;
}