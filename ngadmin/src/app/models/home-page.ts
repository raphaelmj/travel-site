export enum Color {
  bordo = "C92127",
  green = "008c45",
  yellow = "e8c31c",
  orange = "F58220",
  granat = "24266e"
}
// 'C92127','F58220','e8c31c','24266e','008c45'
export interface HomePage {
  id?: number
  title: string
  selfLink: string
  image: string
  color: Color
  target: '_blank' | '_self'
  ordering?: number
}
