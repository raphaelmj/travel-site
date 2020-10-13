import { Menu } from './menu';

export enum LinkDataType {
  Home = 'home',
  Article = 'article',
  Category = 'category',
  ExternalLink = 'external-link',
  Blank = 'blank',
  Gallery = 'gallery',
  Articles = 'articles',
  Events = 'events',
  Event = 'event',
  Catalog = 'catalog',
  Map = 'map',
  Contact = 'contact',
  Custom = 'custom',
  Attachments = 'attachments',
  FormQuestion = 'form_question',
  Invoice = 'invoice',
  Insurance = 'insurance',
  CatalogsPresentation = 'catalogs_presentation',
  InstitutionsList = 'institutions_list',
  RecomendationsFiles = 'recomendations_files',
  DistributionPage = 'distribution_page',
  Content = 'content',
  Sezon = 'sezon'
}

export interface ResourceData {
  type: string;
  link: Link;
}

export interface LinkParams {

}

export interface Link {
  id?: number;
  linkId: any;
  articleId?: any;
  categoryId?: any;
  title: string;
  alias?: string;
  path?: string;
  dataType?: LinkDataType;
  externalLink?: string;
  params?: LinkParams | null;
  status?: number;
  view?: string;
  content?: string | null;
  Menus?: null | Menu[];
  metaTitle?: string;
  metaDesc?: string;
  metaKeywords?: string;
  ordering?: any;
  children?: Link[],
  isFirst?: boolean;
  isLast?: boolean;
  editLink?: boolean;
  resource?: any;
}
