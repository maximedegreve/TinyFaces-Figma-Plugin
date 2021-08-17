import {fetchData} from '../api';
import {GenderType} from '../api/GenderType';

window.onmessage = (event: any) => {
    const {type, message} = event.data.pluginMessage;
    if (type === 'fetch-and-fill') {
        fetchAndFill(message.quality, message.limit, message.gender);
    }
};

function fetchAndFill(quality: number, limit: number, gender: GenderType) {
    fetchData(quality, limit, gender)
        .then((items) => parent.postMessage({pluginMessage: {type: 'fill-with-data', items: items}}, '*'))
        .catch((errors) => parent.postMessage({pluginMessage: {type: 'failed', errors: errors}}, '*'));
}

parent.postMessage({pluginMessage: {type: 'launch-plugin'}}, '*');
