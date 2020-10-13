import { EventElement } from './event-element';
import { ES_GTE_THEN_6 } from '../config'

export interface Hit {
    _id: string;
    _source: EventElement
}


//Freebds

// export interface Source {
//     hits: Hit[];
//     total: number;
// }

//Windows
export interface Source {
    hits: Hit[]
    total: { value: number, relation?: string } | any | number
}

if (ES_GTE_THEN_6) {

} else {

}


export interface IndexResponse {
    hits: Source;
    timed_out: boolean;
}
