export interface ArtQueryParams {
  limit: number;
  start: number;
  column: string;
  order: string;
  phrase?: string;
  categoryId?: number;
}
