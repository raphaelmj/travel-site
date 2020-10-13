import { Pipe, PipeTransform } from '@angular/core';
import { Link } from '../models/link';

@Pipe({
  name: 'resourceByType'
})
export class ResourceByTypePipe implements PipeTransform {



  transform(value: Link, args?: any): any {
    return this.getTypeViewData(value);
  }

  getTypeViewData(link: Link) {

    var title: string | null = null;

    switch (link.dataType) {

      case 'article':
        if (link.resource.data != null)
          title = link.resource.data.title;

        break;

      case 'category':

        if (link.resource.data != null)
          title = link.resource.data.name;

        break;


      case 'external-link':
        if (link.resource.data != null)
          title = link.externalLink;

        break;

      case 'blank':

        if (link.resource.data != null)
          title = null;

        break;

      default:
        if (link.resource.data != null)
          title = null;

        break;

    }

    return title;

  }

}
