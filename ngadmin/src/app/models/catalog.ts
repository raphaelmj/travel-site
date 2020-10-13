export interface CatalogImage {
  path: string
  sizeString: string
}

export interface Catalog {
  id?: number | string | '';
  image: CatalogImage | null
  name: string;
  alias?: string;
  current: boolean;
  searchList: boolean
  attachFile: string
  ordering?: number | null
}
