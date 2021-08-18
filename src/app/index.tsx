import {fetchData} from '../api';
import {GenderType} from '../api/GenderType';
import {ItemType} from '../api/ItemType';

window.onmessage = (event: any) => {
    const {type, message} = event.data.pluginMessage;
    if (type === 'fetch-and-fill') {
        fetchAndFill(message.quality, message.limit, message.gender, message.idsShapes, message.idsText);
    }
};

function fetchAndFill(
    quality: number,
    limit: number,
    gender: GenderType,
    idsShapes: Array<string>,
    idsText: Array<string>
) {
    fetchData(quality, limit, gender)
        .then((items) => {
            fetchAndFillImages(items, idsShapes);
            fillText(items, idsText);
        })
        .catch((errors) => parent.postMessage({pluginMessage: {type: 'failed', errors: errors}}, '*'));
}

function fillText(items: Array<ItemType>, idsText: Array<string>) {
    items.forEach((item, index) =>
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'fill-with-text',
                    text: `${item.first_name} ${item.last_name}`,
                    targetId: idsText[index],
                },
            },
            '*'
        )
    );
}

function fetchAndFillImages(items: Array<ItemType>, idsShapes: Array<string>) {
    const actions = items.map((item, index) => fetchImageFromURLAndReplace(item.url, idsShapes[index]));
    Promise.all(actions).then(() => parent.postMessage({pluginMessage: {type: 'close'}}, '*'));
}

async function fetchImageFromURLAndReplace(url: string, targetID: string): Promise<void> {
    const response = await fetch(url);

    if (response.ok) {
        const buffer = await response.arrayBuffer();
        parent.postMessage(
            {pluginMessage: {type: 'fill-with-data', data: new Uint8Array(buffer), targetId: targetID}},
            '*'
        );
    }
}

parent.postMessage({pluginMessage: {type: 'launch-plugin'}}, '*');
