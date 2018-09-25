import React from 'react';
import ProppTypes from 'prop-types';
import { DojotBtnRedCircle } from '../../../../components/DojotButton';


const DeviceUserActions = ({ setModal, deviceid }) => (
    <div>
        <DojotBtnRedCircle
            to={`/device/id/${deviceid}/edit`}
            icon="fa fa-pencil"
            tooltip="Edit device"
        />
        <DojotBtnRedCircle
            icon=" fa fa-trash"
            tooltip="Remove device"
            click={() => setModal(true)}
        />
        <DojotBtnRedCircle
            to="/device/list"
            icon="fa fa-arrow-left"
            tooltip="Return to device list"
        />
    </div>
);

DeviceUserActions.propTypes = {
    setModal: ProppTypes.func.isRequired,
    deviceid: ProppTypes.number.isRequired,
};

export default DeviceUserActions;
