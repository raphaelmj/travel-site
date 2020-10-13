export interface Recommendation {
  id?: number
  name?: string | null
  image?: string | null
  file?: string
  status: boolean
  ordering?: number | null
}
