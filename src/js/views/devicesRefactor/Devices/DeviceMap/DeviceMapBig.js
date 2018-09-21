import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BigPositionRenderer } from '../../../utils/Maps';

class DeviceMapBig extends Component {
    constructor(props) {
        super(props);
        this.state = { };

        this.handleGeoDevices = this.handleGeoDevices.bind(this);
        this.markerList = [];
        this.clusterers = {};
    }

    handleGeoDevices() {
        const { clusterers } = this.props;
        this.clusterers = [];
        clusterers.forEach((element, i1) => {
            const clstr = { index: i1, devices: [] };
            element.devices.forEach((item) => {
                if (item.geo !== undefined) {
                    clstr.devices.push({
                        id: item.id,
                        lat: item.geo.lat,
                        lng: item.geo.lng,
                        pos: [
                            parseFloat('-23.5373'),
                            parseFloat('-46.6293'),
                        ],
                        label: item.label,
                        timestamp: item.timestamp,
                        key: item.id,
                    });
                }
            });
            this.clusterers.push(clstr);
        });
    }

    render() {
        const { Config, devices } = this.props;
        this.handleGeoDevices();
        return (
            <BigPositionRenderer
                showLayersIcons
                config={Config}
                devices={devices}
                allowContextMenu
                clusterers={this.clusterers}
            />
        );
    }
}

DeviceMapBig.propTypes = {
    clusterers: PropTypes.array.isRequired,
    devices: PropTypes.array.isRequired,
    Config: PropTypes.array.isRequired,
};

export default DeviceMapBig;
