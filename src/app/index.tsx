import {fetchData} from '../api';
import {GenderType} from '../api/GenderType';
import {ItemType} from '../api/ItemType';

window.onmessage = (event: any) => {
    const {type, message} = event.data.pluginMessage;
    if (type === 'fetch-and-fill') {
        fetchAndFill(message.quality, message.limit, message.gender, message.targetIds);
    }
};

function fetchAndFill(quality: number, limit: number, gender: GenderType, targetIds: Array<string>) {
    fetchData(quality, limit, gender)
        .then((items) => fetchImages(items, targetIds))
        .catch((errors) => parent.postMessage({pluginMessage: {type: 'failed', errors: errors}}, '*'));
}

function fetchImages(items: Array<ItemType>, targetIds: Array<string>) {
    items.forEach((item, index) => fetchImageFromURLAndReplace(item.url, targetIds[index]));
    parent.postMessage({pluginMessage: {type: 'fill-layer-with-data', items: items}}, '*');
}

function fetchImageFromURLAndReplace(url: string, targetID: string) {
    console.log('fetch image');
    fetch(url)
        .then((r) => {
            try {
                return r.arrayBuffer();
            } catch (error) {
                console.error(error);
            }
        })
        .then((a) =>
            parent.postMessage(
                {pluginMessage: {type: 'fill-with-data', data: new Uint8Array(a), targetId: targetID}},
                '*'
            )
        );
}

parent.postMessage({pluginMessage: {type: 'launch-plugin'}}, '*');
