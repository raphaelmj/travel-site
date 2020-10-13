export enum AttachType {
  excel = "excel",
  pdf = "pdf",
  word = "word",
  image = "image",
  other = "other"
}

export interface AttachDoc {
  path: string
  name: string
  iconType: AttachType
}

export interface Attachment {
  id?: number
  groupName: string
  files: AttachDoc[]
  status: boolean
  ordering?: number | null
}
