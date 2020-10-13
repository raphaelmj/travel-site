export enum AttractionTypeEnum {
  any = 'any',
  park = 'park',
  muzeum = 'muzeum',
  monument = 'monument',
  sacral = 'sacral',
  nature = 'nature',
  aqua = 'aqua',
  sport = 'sport',
  education = 'education',
  culture = 'culture'
}


export interface Attraction {
  id?: number;
  name: string;
  alias?: string | null
  attractionType: AttractionTypeEnum;
  image?: string;
  description?: string;
  lat: number;
  lng: number;
  added?: boolean
}
