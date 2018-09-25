import deviceManager from '../comms/devices/DeviceManager';
import alt from '../alt';

class DeviceHandlerActions {
    constructor() {
        this.args = '';
    }

    set(args) {
        this.args = args;
        return args;
    }

    update(args) {
        this.args = args;
        return args;
    }

    fetch(id) {
        return (dispatch) => {
            dispatch();
            deviceManager.getDevice(id)
                .then((d) => { this.set(d); })
                .catch((error) => { console.error('Failed to get device', error); });
        };
    }
}
const FormActions = alt.createActions(DeviceHandlerActions);
export const AttrActions = alt.generateActions('update');
export default FormActions;
