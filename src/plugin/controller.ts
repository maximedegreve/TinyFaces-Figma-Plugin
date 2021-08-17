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
    const ids = figma.currentPage.selection.filter((n) => n.type === 'RECTANGLE').map((node) => node.id);

    figma.ui.postMessage({
        type: 'fetch-and-fill',
        message: {quality: quality, limit: ids.length, gender: gender, targetIds: ids},
    });
}

function fillWithData(data: Uint8Array, targetId: string) {
    const layer = figma.root.findOne((n) => n.id === targetId);
    console.log(layer);
    console.log(data);
    console.log(targetId);
    closePlugin();
}

function showNotification(message: string) {
    figma.notify(message);
}
function closePlugin() {
    figma.closePlugin();
}
