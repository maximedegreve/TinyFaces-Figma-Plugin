import {GenderType} from '../api/GenderType';
import {ItemType} from '../api/ItemType';

figma.showUI(__html__, {visible: false});
figma.ui.onmessage = (msg) => {
    if (msg.type === 'launch-plugin') {
        launchPlugin();
    }

    if (msg.type === 'fill-with-data') {
        fillWithData(msg.items);
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

function fillWithData(items: Array<ItemType>) {
    console.log(items);
    const nodes = [];

    for (let i = 0; i < 5; i++) {
        const rect = figma.createRectangle();
        rect.x = i * 150;
        rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
        figma.currentPage.appendChild(rect);
        nodes.push(rect);
    }

    figma.currentPage.selection = nodes;

    console.log('🤲');

    closePlugin();
}

function showNotification(message: string) {
    figma.notify(message);
}
function closePlugin() {
    figma.closePlugin();
}
