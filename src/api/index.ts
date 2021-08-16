import {ItemType} from './ItemType';

type JSONResponse = {
    data?: Array<ItemType>;
    errors?: Array<{message: string}>;
};

export async function fetchData(quality: number, limit: number): Promise<Array<ItemType>> {
    var url = new URL('https://tinyfac.es/api/data');
    const params = {quality: quality, limit: limit};
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

    const response = await fetch(url.toString());
    const {data, errors}: JSONResponse = await response.json();

    if (response.ok) {
        return data;
    } else {
        return Promise.reject(errors);
    }
}
