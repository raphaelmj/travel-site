export const API_URL = 'http://localhost:3000'
// export const API_URL: string = 'https://wirtur.arturi21.usermd.net'

// export const TINY_API_KEY = "807u0194cyejkdqdoztfb39cxelww5ppwlmmut7tr2ouqgaj";
// export const TINY_EDITOR_CONFIG = {
//   automatic_uploads: true,
//   file_picker_types: 'image',
//   file_picker_callback: (cb, value, meta) => {

//     var input = document.createElement('input');
//     input.setAttribute('type', 'file');
//     input.setAttribute('accept', 'image/*');
//     input.click();

//   },
//   plugins: ['code', 'link', 'autoresize', 'image'],
//   toolbar: 'undo redo | link image | code'
// };


export interface EventType {
  name: string;
  value: string;
}


export const EVENT_TYPES: EventType[] = [
  {
    name: 'wszystkie typy',
    value: 'all'
  },
  {
    name: 'Wycieczki szkolne',
    value: 'template'
  },
  {
    name: 'Zimowiska',
    value: 'winter'
  },
  {
    name: 'Kolonie letnie',
    value: 'summer'
  }
]

export interface DaysInterval {
  name: string;
  value: string;
}

export const DAYS: DaysInterval[] = [
  {
    name: 'dowolna',
    value: 'all'
  },
  {
    name: '1-3',
    value: '1:3'
  },
  {
    name: '3-7',
    value: '3:7'
  },
  {
    name: '7-14',
    value: '7:14'
  },
  {
    name: '14 i więcej',
    value: '14'
  }
]

export interface Ordering {
  name: string;
  value: string;
}

export const ORDERING: Ordering[] = [
  {
    name: 'brak',
    value: 'default'
  },
  {
    name: 'data rozpoczęcia',
    value: 'startAt'
  },
  {
    name: 'liczba dni',
    value: 'daysMin'
  },
  // {
  //     name: 'cena',
  //     value: 'priceBrutto'
  // }
]

export interface AttractionType {
  type: string;
  name: string;
  selected?: boolean;
}

export const ATTRACTIONS_TYPE: AttractionType[] = [
  { type: 'park', name: 'Parki', selected: false },
  { type: 'muzeum', name: 'Muzea', selected: false },
  { type: 'monument', name: 'Pomniki', selected: false },
  { type: 'sacral', name: 'Zabytki sakralne', selected: false },
  { type: 'nature', name: 'Natura', selected: false },
  { type: 'aqua', name: 'Woda', selected: false },
  { type: 'sport', name: 'Sport', selected: false },
  { type: 'education', name: 'Edukacja', selected: false },
  { type: 'culture', name: 'Kultura', selected: false },
  { type: 'any', name: 'Pozostałe', selected: false }
]


export const CK_EDITOR_CONFIG = {
  allowedContent: true,
  format_tags: 'p;h1;h2;h3;h4;h5;h6',
  extraPlugins: 'font,justify,sourcedialog',
  toolbar: [
    { name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
    { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
    { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
    '/',
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
    { name: 'links', items: ['Link', 'Unlink'] },
    { name: 'insert', items: ['Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
    '/',
    { name: 'styles', items: ['Styles', 'Format', 'FontSize'] },
    { name: 'colors', items: ['TextColor', 'BGColor'] },
    { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
    { name: 'about', items: ['About'] }
  ]
};

