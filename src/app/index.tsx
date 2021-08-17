import {fetchData} from '../api';

window.onmessage = (event: any) => {
    const {type} = event.data.pluginMessage;
    if (type === 'fetch-and-fill') {
        fetchAndFill();
    }
};

function fetchAndFill() {
    fetchData({quality: 0, limit: 20})
        .then((items) => parent.postMessage({pluginMessage: {type: 'fill-with-data', items: items}}, '*'))
        .catch((errors) => parent.postMessage({pluginMessage: {type: 'failed', errors: errors}}, '*'));
}

parent.postMessage({pluginMessage: {type: 'launch-plugin'}}, '*');
