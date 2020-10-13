// export const API_URL: string = 'http://localhost:3000'
export const API_URL: string = 'https://wirtur.arturi21.usermd.net'

export interface DaysInterval {
  name: string;
  value: string;
}

export const DAYS: DaysInterval[] = [
  {
    name: 'dowolna',
    value: 'all'
  },
  {
    name: '1-3',
    value: '1:3'
  },
  {
    name: '3-7',
    value: '3:7'
  },
  {
    name: '7-14',
    value: '7:14'
  },
  {
    name: '14 i więcej',
    value: '14'
  }
]

export interface AttractionType {
  type: string;
  name: string;
  selected?: boolean;
}

export const ATTRACTIONS_TYPE: AttractionType[] = [
  { type: 'park', name: 'Parki', selected: false },
  { type: 'muzeum', name: 'Muzea', selected: false },
  { type: 'monument', name: 'Pomniki', selected: false },
  { type: 'sacral', name: 'Zabytki sakralne', selected: false },
  { type: 'nature', name: 'Natura', selected: false },
  { type: 'aqua', name: 'Woda', selected: false },
  { type: 'sport', name: 'Sport', selected: false },
  { type: 'education', name: 'Edukacja', selected: false },
  { type: 'culture', name: 'Kultura', selected: false },
  { type: 'any', name: 'Pozostałe', selected: false }
]


export const ES_GTE_THEN_6 = false
