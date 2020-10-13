import { MicroGalleryImage } from './tour-event';
import { Category } from './category';

// export interface Dimension {
//   height: number;
//   width: number;
//   type: string;
// }

// export interface GalleryImage {
//   image: string;
//   imageThumb: string;
//   sizeString: string;
//   stringDimensions: string;
//   dimensions: Dimension,
//   imgDesc: string;
// }

export interface Article {
  id?: number
  title: string
  alias?: string
  image?: string
  microGallery?: null | MicroGalleryImage[]
  smallDesc: string
  longDesc: string
  onHome?: boolean
  ordering?: number
  status?: boolean
  metaDescription: string
  metaKeywords: string
  publishedAt?: any
  categoryId?: number | null
  category?: Category
}
