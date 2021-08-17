import {ItemType} from './ItemType';

type JSONResponse = Array<ItemType>;

export async function fetchData({quality = 10, limit = 20}): Promise<Array<ItemType>> {
    const url = `https://tinyfac.es/api/data?quality=${quality}&limit=${limit}`;

    const response = await fetch(url);

    const items: JSONResponse = await response.json();

    if (response.ok) {
        return items;
    } else {
        return Promise.reject();
    }
}
