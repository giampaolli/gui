import deviceManager from '../comms/devices/DeviceManager';
import toaster from '../comms/util/materialize';

const alt = require('../alt');

class DeviceActions {
    constructor() {
        this.device = {};
        this.deviceId = '';
        this.devices = [];
        this.list = [];
        this.error = '';
    }

    fetchDevices(params = null, cb) {
        return (dispatch) => {
            dispatch();
            deviceManager
                .getDevices(params)
                .then((result) => {
                    this.updateDevices(result);
                    if (cb) {
                        cb(result);
                    }
                })
                .catch((error) => {
                    this.devicesFailed(error);
                });
        };
    }

    fetchSingle(deviceid, cb) {
        return (dispatch) => {
            dispatch();

            deviceManager
                .getDevice(deviceid)
                .then((device) => {
                    this.updateSingle(device);
                    if (cb) {
                        cb(device);
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch single device', error);
                    this.devicesFailed(error);
                });
        };
    }

    fetchDevicesByTemplate(templateId, params = null, cb) {
        return (dispatch) => {
            dispatch();

            deviceManager
                .getDeviceByTemplateId(templateId, params)
                .then((result) => {
                    this.updateDevices(result);
                    if (cb) {
                        cb(result);
                    }
                })
                .catch((error) => {
                    this.devicesFailed(error);
                });
        };
    }

    updateDevices(list) {
        this.list = list;
        return list;
    }

    insertDevice(devices) {
        this.devices = devices;
        return devices;
    }

    addDevice(device, cb) {
        const newDevice = device;
        return (dispatch) => {
            dispatch();
            deviceManager
                .addDevice(newDevice)
                .then((response) => {
                    this.insertDevice(response.devices[0]);
                    if (cb) {
                        cb(response.devices[0]);
                    }
                })
                .catch((error) => {
                    this.devicesFailed(error);
                });
        };
    }

    triggerUpdate(device, cb) {
        return (dispatch) => {
            dispatch();
            deviceManager
                .setDevice(device)
                .then(() => {
                    this.updateSingle(device);
                    if (cb) {
                        cb(device);
                    }
                })
                .catch((error) => {
                    this.devicesFailed(error);
                });
        };
    }

    updateSingle(device) {
        this.device = device;
        return device;
    }

    updateStatus(device) {
        this.device = device;
        return device;
    }

    triggerRemoval(device, cb) {
        return (dispatch) => {
            dispatch();
            deviceManager.deleteDevice(device.id)
                .then((response) => {
                    this.removeSingle(device.id);
                    if (cb) {
                        cb(response);
                    }
                })
                .catch(() => {
                    this.devicesFailed('Failed to remove given device');
                });
        };
    }

    removeSingle(deviceId) {
        this.deviceId = deviceId;
        return deviceId;
    }

    devicesFailed(error) {
        this.error = error;
        toaster.error(error.message);
        return error;
    }
}

alt.createActions(DeviceActions, exports);
