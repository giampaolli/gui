/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement"] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hashHistory } from 'react-router';
import { NewPageHeader } from '../../../../containers/full/PageHeader';
import MeasureActions from '../../../../actions/MeasureActions';
import DeviceActions from '../../../../actions/DeviceActions';
import { Loading } from '../../../../components/Loading';
import toaster from '../../../../comms/util/materialize';
import { RemoveModal } from '../../../../components/Modal';
import DeviceUserActions from './DeviceUserActions';
import DeviceHeader from './DeviceHeader';
import DeviceDetail from './DeviceDetail';

class ViewDeviceImpl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
        this.setModal = this.setModal.bind(this);
        this.remove = this.remove.bind(this);
    }

    componentWillMount() {
        const { devices, deviceId } = this.props;
        const device = devices[deviceId];
        if (device === undefined) return; // not ready

        for (const i in device.attrs) {
            for (const j in device.attrs[i]) {
                if (device.attrs[i][j].type !== 'meta') {
                    MeasureActions.fetchMeasure.defer(device, device.attrs[i][j].label, 10);
                }
            }
        }
    }

    setModal(status) {
        this.setState({ showModal: status });
    }

    remove(e) {
        // This should be on DeviceUserActions -
        // this is not good, but will have to make do because of z-index on the action header
        const { deviceId } = this.props;
        e.preventDefault();
        DeviceActions.triggerRemoval({ id: deviceId }, () => {
            toaster.success('Device removed.');
            hashHistory.push('/device/list');
        });
    }

    render() {
        const { devices, deviceId } = this.props;
        const { showModal } = this.state;
        let device;

        if (devices !== undefined) {
            if (Object.prototype.hasOwnProperty.call(devices, deviceId)) {
                device = devices[deviceId];
            }
        }

        if (device === undefined) {
            return (<Loading />);
        }

        return (
            <div className="full-height bg-light-gray">
                <NewPageHeader title="Devices" subtitle="device manager" icon="device">
                    <div className="box-sh">
                        <DeviceUserActions
                            devices={devices}
                            deviceid={device.id}
                            setModal={this.setModal}
                        />
                    </div>
                </NewPageHeader>
                <DeviceHeader device={device} />
                <DeviceDetail deviceid={device.id} device={device} />
                {
                    showModal
                        ? (
                            <RemoveModal
                                name="device"
                                remove={this.remove}
                                openModal={this.setModal}
                            />
                        )
                        : <div />
                }
            </div>
        );
    }
}

ViewDeviceImpl.defaultProps = {
    devices: [],
};

ViewDeviceImpl.propTypes = {
    deviceId: PropTypes.string.isRequired,
    devices: PropTypes.arrayOf(PropTypes.shape({

    })),
};

export default ViewDeviceImpl;
