export enum TourEventStatus {
  avl = 'avl',
  noavl = 'noavl',
  all = 'all'
}

export enum TourEventType {
  template = 'template',
  organize = 'organize'
}


export enum TourEventSezonType {
  winter = 'winter',
  summer = 'summer',
  any = 'any'
}

export interface QueryParams {
  limit: number;
  page: string | number;
  regions?: string | 'all'
  cities?: string | 'all'
  attractions?: string | 'all'
  themes?: string | 'all'
  ages?: string | 'all'
  days?: string | 'all'
  status: string | TourEventStatus | 'all'
  sezon: string | TourEventSezonType | 'all'
  type: string | TourEventType | 'all'
  order?: string;
  numberPhrase?: string
}
