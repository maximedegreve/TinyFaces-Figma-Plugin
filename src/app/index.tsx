import {fetchData} from '../api';
import {GenderType} from '../api/GenderType';
import {ItemType} from '../api/ItemType';

window.onmessage = (event: any) => {
    const {type, message} = event.data.pluginMessage;
    if (type === 'fetch-and-fill') {
        fetchAndFill(message.quality, message.limit, message.gender);
    }
};

function fetchAndFill(quality: number, limit: number, gender: GenderType) {
    fetchData(quality, limit, gender)
        .then((items) => fetchImages(items))
        .catch((errors) => parent.postMessage({pluginMessage: {type: 'failed', errors: errors}}, '*'));
}

function fetchImages(items: Array<ItemType>) {
    items.forEach((item) => fetchImageFromURLAndReplace(item.url, '123'));
    parent.postMessage({pluginMessage: {type: 'fill-layer-with-data', items: items}}, '*');
}

function fetchImageFromURLAndReplace(url: string, targetID: string) {
    console.log('fetch image');
    fetch(url)
        .then((r) => {
            try {
                console.log('fetch image done');

                return r.arrayBuffer();
            } catch (error) {
                console.error(error);
            }
        })
        .then((a) =>
            parent.postMessage(
                {pluginMessage: {type: 'fill-with-data', data: new Uint8Array(a), targetID: targetID}},
                '*'
            )
        );
}

parent.postMessage({pluginMessage: {type: 'launch-plugin'}}, '*');
