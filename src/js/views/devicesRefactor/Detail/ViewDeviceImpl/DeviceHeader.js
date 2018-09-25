/* eslint jsx-a11y/label-has-associated-control: 0 */
import React from 'react';
import PropTypes from 'prop-types';

const DeviceHeader = ({ device }) => (
    <div className="row devicesSubHeader p0 device-details-header">
        <div className="col s8 m8">
            <label className="col s12 device-label truncate" title={device.label}>
                {' '}
                {device.label}
            </label>
            <div className="col s12 device-label-name">Name</div>
        </div>
    </div>
);

DeviceHeader.propTypes = {
    device: PropTypes.objectOf(PropTypes.shape({
        label: PropTypes.string,
    })).isRequired,
};

export default DeviceHeader;
