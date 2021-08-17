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
        showNotification('Something went wrong 😥');
    }
};

function launchPlugin() {
    switch (figma.command) {
        case 'fill-high-quality':
            fetchAndFill(10, 20);
            break;

        case 'fill-low-quality':
            fetchAndFill(0, 20);
            break;

        case 'fill-male':
            fetchAndFill(0, 20, GenderType.Male);
            break;

        case 'fill-female':
            fetchAndFill(0, 20, GenderType.Female);
            break;

        case 'fill-non-binary':
            fetchAndFill(0, 20);
            break;
        default:
    }
}

function fetchAndFill(quality: number, limit: number, gender?: GenderType) {
    figma.ui.postMessage({
        type: 'fetch-and-fill',
        message: {quality: quality, limit: limit, gender: gender},
    });
}

function fillWithData(data: Uint8Array, targetId: string) {
    const layer = figma.root.findOne((n) => n.id === targetId);
    console.log(layer);
    closePlugin();
}

function showNotification(message: string) {
    figma.notify(message);
}
function closePlugin() {
    figma.closePlugin();
}
