export interface IndexCriteriaSource {
    id: number;
    name: string;
    alias: string;
    localType: string;
    baseType: string;
    lat: number;
    lng: number;
}

export interface IndexCriteria {
    _id: string,
    _source: IndexCriteriaSource,
    icon?: string;
    total?: number | string | any | { value: number, relation?: string }
    query?: string;
}