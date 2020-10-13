export interface EventIndexElement {
  _index: string;
  _type: string;
  _id: string;
  _source: EventElementData
}

export interface EventElementData {
  eid: number;
  catalogId: number | null;
  catalogName: string | null;
  link: string;
  name: string;
  alais: string;
  number: string;
  image: string | null;
  startAt: Date;
  endAt: Date;
  eventType: string;
  eventSezonType: string;
  smallDesc: string | null;
  status: string;
  content: string;
  priceBrutto?: number | null;
}
