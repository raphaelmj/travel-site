export enum WidgetAliasType {
  insurnace = 'insurnace',
  invoice = 'invoice',
  map_info = 'map_info',
  cookie = 'cookie',
  contact = 'contact',
  cert = 'cert',
  fcontact = 'fcontact'
}

export interface WidgetInsuranceData {
  topDesc: string
  regDesc: string
}
export interface WidgetInvoiceData {
  topDesc: string
  regDesc: string
}
export interface WidgetMapInfoData {
  content: string
}
export interface WidgetCookieData {
  content: string
}
export interface WidgetContactData {
  firmName: string
  address: string
  email: string
  firstPhones: string[]
  secondPhones: string[]
  banks: Array<{ name: string, accounts: string[] }>
}

export interface ImageWSize {
  image: string
  sizeString: string
}

export interface WidgetCertData {
  image: ImageWSize
}

export interface WidgetsGroup {
  insurnace: Widget
  invoice: Widget
  map_info: Widget
  cookie: Widget
  contact: Widget,
  cert: Widget
  fcontact: Widget
}

export interface Widget {
  id: number
  title: string
  targetAlias: WidgetAliasType
  dataType: WidgetAliasType
  data: WidgetInsuranceData | WidgetInvoiceData | WidgetMapInfoData | WidgetMapInfoData | WidgetCookieData | WidgetContactData | WidgetCertData | null
}
