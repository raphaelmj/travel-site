import { DocFormType } from './doc';

export interface DocQueryParams {
  limit: number;
  page: string | number;
  type: DocFormType | 'all'
  phrase?: string
}
