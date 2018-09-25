/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement"] */
import FormActions, { AttrActions } from '../actions/DeviceHandlerActions';
import util from '../comms/util/util';

const alt = require('../alt');

class DeviceHandlerStore {
    constructor() {
        this.device = {}; this.set();
        this.usedTemplates = {};

        this.attrNames = {};
        this.attrError = '';
        this.fieldError = {};

        this.bindListeners({
            set: FormActions.SET,
            updateDevice: FormActions.UPDATE,
            fetch: FormActions.FETCH,
            setAttributes: AttrActions.UPDATE,
        });
        this.set(null);
    }

    loadAttrs() {
        // TODO: it actually makes for sense in the long run to use (id, key) for attrs which
        //       will allow name updates as well as better payload to event mapping.
        this.attrNames = {};
        if ((this.device === undefined) || (this.device === null)) {
            return;
        }

        for (const tmpId in this.device.attrs) {
            for (const index in this.device.attrs[tmpId]) {
                const att = this.device.attrs[tmpId][index];
                if (String(att.type) === 'static') {
                    this.attrNames[att.id] = att.static_value;
                }
            }
        }
    }

    fetch(id) {}

    set(device) {
        if (device === null || device === undefined) {
            this.device = {
                label: '',
                id: '',
                protocol: 'MQTT',
                templates: [],
                tags: [],
                attrs: [],
            };
            this.usedTemplates = {};
        } else {
            this.device = device;
            this.usedTemplates = device.templates;
            this.loadAttrs();
            // console.log('Device was updated in Store: ', this.device);
        }
    }

    updateDevice(diff) {
        this.device[diff.f] = diff.v;
    }

    setAttributes(attrList) {
        this.device.attrs = [];
        for (const k in attrList) {
            if (!util.isTypeValid(attrList[k].value, attrList[k].type)) {
                return;
            }

            if (attrList[k].hasOwnProperty('value')) {
                attrList[k].static_value = attrList[k].value;
                delete attrList[k].value;
            }
            this.device.attrs.push(JSON.parse(JSON.stringify(attrList[k])));
        }
        // console.log('All attributes were set.', this.device);
    }
}

const DeviceFormStore = alt.createStore(DeviceHandlerStore, 'DeviceFormStore');

export default DeviceFormStore;
