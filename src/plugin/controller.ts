import {GenderType} from '../api/GenderType';

figma.showUI(__html__, {visible: false});

figma.ui.onmessage = (msg) => {
    if (msg.type === 'launch-plugin') {
        launchPlugin();
    }

    if (msg.type === 'fill-with-data') {
        fillWithData(msg.data, msg.targetId);
    }

    if (msg.type === 'failed') {
        closePlugin(`⚠️ TinyFaces can't be contacted. Check your internet...`);
    }

    if (msg.type === 'close') {
        closePlugin();
    }
};

function launchPlugin() {
    switch (figma.command) {
        case 'fill-high-quality':
            fetchAndFill(10);
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
    const ids = figma.currentPage.selection
        .filter(
            (node) =>
                node.type === 'FRAME' ||
                node.type === 'ELLIPSE' ||
                node.type === 'POLYGON' ||
                node.type === 'RECTANGLE' ||
                node.type === 'STAR' ||
                node.type === 'VECTOR'
        )
        .map((node) => node.id);

    if (ids.length > 50) {
        closePlugin(`🚨 You can't select more than 50 layers at a time right now.`);
    }

    if (ids.length === 0) {
        closePlugin('🚨 Select at least one or more Frame, Rectangle, Ellipse, Polygon, Star or Vector layer(s)');
    }

    figma.ui.postMessage({
        type: 'fetch-and-fill',
        message: {quality: quality, limit: ids.length, gender: gender, targetIds: ids},
    });
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
