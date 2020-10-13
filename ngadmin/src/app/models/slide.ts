export interface Slide {
  id?: number
  image?: string | null
  link: string
  title: string
  subTitle: string
  linkTitle: string
  ordering: number | null
  target: '_blank' | '_self'
  status: boolean
}
