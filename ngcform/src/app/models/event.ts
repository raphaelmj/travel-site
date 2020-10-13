export interface Event {
  id: number;
  catalogId: number | null;
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
  priceBrutto?: number | null;
}
