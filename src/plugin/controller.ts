import {GenderType} from '../api/GenderType';
import {setCharacters} from '@figma-plugin/helpers';

figma.showUI(__html__, {visible: false});

figma.ui.onmessage = (msg) => {
    if (msg.type === 'launch-plugin') {
        launchPlugin();
    }

    if (msg.type === 'fill-with-data') {
        fillWithData(msg.data, msg.targetId);
    }

    if (msg.type === 'fill-with-text') {
        fillWithText(msg.text, msg.targetId);
    }

    if (msg.type === 'failed') {
        closePlugin(`⛔️ TinyFaces can't be contacted. Check your internet...`);
    }

    if (msg.type === 'close') {
        closePlugin();
    }
};

function launchPlugin() {
    switch (figma.command) {
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
        default:
    }
}

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

async function fillWithText(text: string, targetId: string) {
    const node = figma.currentPage.findOne((n) => n.id === targetId);
    if (node.type === 'TEXT') {
        setCharacters(node, text);
    }
}

async function fillWithData(data: Uint8Array, targetId: string) {
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
