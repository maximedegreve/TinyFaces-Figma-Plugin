import {GenderType} from '../api/GenderType';
import {setCharacters} from '@figma-plugin/helpers';
import {ItemType} from '../api/ItemType';

figma.showUI(__html__, {visible: false});

// Receives messages from index.tsx
figma.ui.onmessage = (msg) => {
    if (msg.type === 'launch-plugin') {
        launchPlugin();
    }

    if (msg.type === 'fill-and-close') {
        fillAndClose(msg.items, msg.idsShapes, msg.idsText, msg.images);
    }

    if (msg.type === 'failed') {
        closePlugin(`⛔️ TinyFaces can't be contacted. Check your internet...`);
    }

    if (msg.type === 'close') {
        closePlugin();
    }
};

// Receives messages from manifest.json
function launchPlugin() {
    switch (figma.command) {
        case 'fill-ai':
            fetchAndFillAI();
            break;

        case 'fill-male-ai':
            fetchAndFillAI(GenderType.Male);
            break;

        case 'fill-female-ai':
            fetchAndFillAI(GenderType.Female);
            break;

        case 'fill-non-binary-ai':
            fetchAndFillAI();
            break;

        case 'fill-high-quality':
            fetchAndFill(8);
            break;

        case 'fill-low-quality':
            fetchAndFill(0);
            break;

        case 'fill-male':
            fetchAndFill(0, GenderType.Male);
            break;

        case 'fill-female':
            fetchAndFill(0, GenderType.Female);
            break;

        case 'fill-non-binary':
            fetchAndFill(0);
            break;

        case 'license':
            openUrl('https://tinyfac.es/license/non-commercial');
            break;

        case 'license-ai':
            openUrl('https://tinyfac.es/dashboard');
            break;

        default:
    }
}

function fetchAndFillAI(gender?: GenderType) {
    const idsShapes = figma.currentPage.selection
        .filter(
            (node) =>
                node.type === 'FRAME' ||
                node.type === 'ELLIPSE' ||
                node.type === 'POLYGON' ||
                node.type === 'RECTANGLE' ||
                node.type === 'STAR' ||
                node.type === 'TEXT' ||
                node.type === 'VECTOR'
        )
        .map((node) => node.id);

    const idsText = figma.currentPage.selection.filter((node) => node.type === 'TEXT').map((node) => node.id);

    if (idsShapes.length > 50 || idsText.length > 50) {
        closePlugin(`🚨 You can't select more than 50 layers at a time right now.`);
    }

    if (idsShapes.length === 0 && idsText.length === 0) {
        closePlugin('🚨 Select at least one or more Frame, Rectangle, Text, Ellipse, Polygon, Star or Vector layer(s)');
    }

    const limit = Math.max(idsText.length, idsShapes.length);

    figma.ui.postMessage({
        type: 'fetch-and-fill-ai',
        message: {limit: limit, gender: gender, idsShapes: idsShapes, idsText: idsText},
    });
}

// Will be deprecated soon
function fetchAndFill(quality: number, gender?: GenderType) {
    const idsShapes = figma.currentPage.selection
        .filter(
            (node) =>
                node.type === 'FRAME' ||
                node.type === 'ELLIPSE' ||
                node.type === 'POLYGON' ||
                node.type === 'RECTANGLE' ||
                node.type === 'STAR' ||
                node.type === 'TEXT' ||
                node.type === 'VECTOR'
        )
        .map((node) => node.id);

    const idsText = figma.currentPage.selection.filter((node) => node.type === 'TEXT').map((node) => node.id);

    if (idsShapes.length > 50 || idsText.length > 50) {
        closePlugin(`🚨 You can't select more than 50 layers at a time right now.`);
    }

    if (idsShapes.length === 0 && idsText.length === 0) {
        closePlugin('🚨 Select at least one or more Frame, Rectangle, Text, Ellipse, Polygon, Star or Vector layer(s)');
    }

    const limit = Math.max(idsText.length, idsShapes.length);

    figma.ui.postMessage({
        type: 'fetch-and-fill',
        message: {quality: quality, limit: limit, gender: gender, idsShapes: idsShapes, idsText: idsText},
    });
}

function fillAndClose(
    items: Array<ItemType>,
    idsShapes: Array<string>,
    idsText: Array<string>,
    images: Array<Uint8Array>
) {
    // Fill Images (Sync)
    idsShapes.slice(0, images.length).forEach((id, index) => {
        fillWithData(images[index], id);
    });

    // Fill Text (Async)
    const fillText = idsText
        .slice(0, items.length)
        .map((id, index) => fillWithText(`${items[index].first_name} ${items[index].last_name}`, id));

    Promise.all(fillText).then(() => {
        closePlugin();
    });
}

async function fillWithText(text: string, targetId: string): Promise<boolean> {
    const node = figma.currentPage.findOne((n) => n.id === targetId);
    if (node.type === 'TEXT') {
        const result = await setCharacters(node, text);
        return result;
    }
}

function openUrl(url: string) {
    figma.ui.postMessage({
        type: 'open-url',
        message: {url: url},
    });
}

function fillWithData(data: Uint8Array, targetId: string) {
    const node = figma.currentPage.findOne((n) => n.id === targetId);
    if (
        node.type === 'FRAME' ||
        node.type === 'ELLIPSE' ||
        node.type === 'POLYGON' ||
        node.type === 'RECTANGLE' ||
        node.type === 'STAR' ||
        node.type === 'VECTOR'
    ) {
        const image = figma.createImage(data);
        node.fills = [{type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL'}];
    }
}

function closePlugin(message?: string) {
    figma.closePlugin(message);
}
