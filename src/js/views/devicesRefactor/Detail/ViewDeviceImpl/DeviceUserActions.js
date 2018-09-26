/* eslint-disable */
import React, { Component } from 'react';
// import ProppTypes from 'prop-types';
import { DojotBtnRedCircle } from '../../../../components/DojotButton';

class DeviceUserActions extends Component {
    constructor(props) {
        super(props);
        this.removeDevice = this.removeDevice.bind(this);
    }

    removeDevice(event) {
        this.props.setModal(true);
    }

    render() {
        return (
            <div>
                <DojotBtnRedCircle
                    to={`/device/id/${this.props.deviceid}/edit`}
                    icon="fa fa-pencil"
                    tooltip="Edit device"
                />
                <DojotBtnRedCircle
                    icon=" fa fa-trash"
                    tooltip="Remove device"
                    click={this.removeDevice}
                />
                <DojotBtnRedCircle
                    to="/device/list"
                    icon="fa fa-arrow-left"
                    tooltip="Return to device list"
                />
            </div>
        );
    }
}

// DeviceUserActions.propTypes = {
//     setModal: ProppTypes.func.isRequired,
//     deviceid: ProppTypes.number.isRequired,
// };

export default DeviceUserActions;
