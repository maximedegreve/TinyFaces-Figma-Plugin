import {fetchData, fetchAIData} from '../api';
import {GenderType} from '../api/GenderType';
import {ItemType} from '../api/ItemType';

window.onmessage = (event: any) => {
    const {type, message} = event.data.pluginMessage;
    if (type === 'fetch-and-fill') {
        fetchAndFill(message.quality, message.limit, message.gender, message.idsShapes, message.idsText);
    }
    if (type === 'fetch-and-fill-ai') {
        fetchAndFillAI(message.quality, message.limit, message.gender, message.idsShapes, message.idsText);
    }
    if (type === 'open-url') {
        openUrl(message.url);
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
            fetchImagesAndFill(items, idsShapes, idsText);
        })
        .catch((errors) => parent.postMessage({pluginMessage: {type: 'failed', errors: errors}}, '*'));
}

function fetchAndFillAI(limit: number, gender: GenderType, idsShapes: Array<string>, idsText: Array<string>) {
    fetchAIData(limit, gender)
        .then((items) => {
            fetchImagesAndFill(items, idsShapes, idsText);
        })
        .catch((errors) => parent.postMessage({pluginMessage: {type: 'failed', errors: errors}}, '*'));
}

function fetchImagesAndFill(items: Array<ItemType>, idsShapes: Array<string>, idsText: Array<string>) {
    const imageActions = items.slice(0, idsShapes.length).map((item) => fetchImageFromURL(item.url));
    Promise.all(imageActions).then((imageBuffers) =>
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'fill-and-close',
                    items: items,
                    idsShapes: idsShapes,
                    idsText: idsText,
                    images: imageBuffers,
                },
            },
            '*'
        )
    );
}

async function fetchImageFromURL(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);

    if (response.ok) {
        const buffer = await response.arrayBuffer();
        return new Uint8Array(buffer);
    }
}

function openUrl(url: string) {
    window.open(url, '_blank');
    parent.postMessage(
        {
            pluginMessage: {
                type: 'close',
            },
        },
        '*'
    );
}

parent.postMessage({pluginMessage: {type: 'launch-plugin'}}, '*');
