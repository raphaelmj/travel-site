export interface Institution {
  id?: number
  name?: string | null
  logo?: string | null
  tourTarget?: string
  description: string
  status: boolean
  ordering?: number | null
}
