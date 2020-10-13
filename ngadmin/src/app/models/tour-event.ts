import { TourEventStatus, TourEventType, TourEventSezonType } from './query-params';
import { Age } from './age';
import { Day } from './day';
import { Catalog } from './catalog';
import { Region } from './region';
import { City } from './city';
import { Attraction } from './attraction';
import { Theme } from './theme';

export interface MicroGalleryImage {
  image: string
  width: number
  height: number
  sizeString: string
}


export interface TourEventAttachment {
  file: string
  name: string
}


export interface PricePerDays {
  from: number
  to: number
  price: number
  days: number
}


export interface PriceConfig {
  groupName: string | null
  groupDesc: string | null
  prices: PricePerDays[]
}



export interface TourEvent {
  id?: number
  number?: string
  image: string | null
  name: string
  alias?: string
  smallDesc: string | null
  longDesc: string | null
  microGallery: MicroGalleryImage[]
  attachments: TourEventAttachment[] | null
  priceNetto: number | null
  priceBrutto: number | null
  tax: number | null
  priceConfig: PriceConfig[] | null
  status: TourEventStatus
  eventType: TourEventType
  eventSezonType: TourEventSezonType
  customersLimit: number | null
  startAt: Date | null
  endAt: Date | null
  atSezon?: boolean
  metaDescription: string
  metaKeywords: string
  catalogId: number | null
  catalog?: Catalog
  Ages?: Age[]
  Days?: Day[],
  Regions?: Region[],
  Cities?: City[],
  Attractions?: Attraction[],
  Themes?: Theme[]
  updatedAt?: Date
  createdAt?: Date
}
