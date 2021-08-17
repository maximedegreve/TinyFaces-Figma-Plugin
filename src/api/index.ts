import {ItemType} from './ItemType';
import {GenderType} from './GenderType';

type JSONResponse = Array<ItemType>;

export async function fetchData(quality = 10, limit = 20, gender?: GenderType): Promise<Array<ItemType>> {
    var url = `https://tinyfac.es/api/data?quality=${quality}&limit=${limit}`;

    if (gender) {
        url = url + '&gender=' + gender;
    }

    const response = await fetch(url);

    const items: JSONResponse = await response.json();

    if (response.ok) {
        return items;
    } else {
        return Promise.reject();
    }
}
