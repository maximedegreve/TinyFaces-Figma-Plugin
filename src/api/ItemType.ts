import {GenderType} from './GenderType';

export type ItemType = {
    id: number;
    url: string;
    gender: GenderType;
    first_name: string;
    last_name: string;
};
