import { TourEvent } from './tour-event';

export enum DocFormType {
  insurance = "insurance",
  invoice = "invoice",
  question = "question"
}

export interface InsuranceData {
  name: string
  email: string
  phone: string
  number: string
  description: string
  event?: TourEvent | null
}

export interface InvoiceData {
  name: string
  email: string
  phone: string
  number: string
  description: string
  event?: TourEvent | null
}

export interface Doc {
  id?: number
  number: string
  type: DocFormType
  noticeInfo: InsuranceData | InvoiceData
  suffix: string
  mimeType: string
  tokenData: string
  tokenUrl: string
  uploadAt: any
}
