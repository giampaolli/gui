/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import ConfigStore from '../../../stores/ConfigStore';
import MeasureStore from '../../../stores/MeasureStore';
import MeasureActions from '../../../actions/MeasureActions';
import DeviceMap from './DeviceMap';

class MapWrapper extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const devices = this.props.devices;
        for (const deviceID in devices) {
            for (const templateID in devices[deviceID].attrs) {
                for (const attrID in devices[deviceID].attrs[templateID]) {
                    if (devices[deviceID].attrs[templateID][attrID].type === 'dynamic') {
                        if (devices[deviceID].attrs[templateID][attrID].value_type === 'geo:point') {
                            MeasureActions.fetchPosition.defer(devices[deviceID], devices[deviceID].id, devices[deviceID].attrs[templateID][attrID].label);
                        }
                    }
                }
            }
        }
    }

    render() {
        return (
            <AltContainer stores={{Measure: MeasureStore, Config: ConfigStore}}>
                <DeviceMap devices={this.props.devices} showFilter={this.props.showFilter} dev_opex={this.props.dev_opex} />
            </AltContainer>
        );
    }
}

// MapWrapper.propTypes = {
//     devices: PropTypes.arrayOf.isRequired,
//     showFilter: PropTypes.func.isRequired,
//     devOpex: PropTypes.func.isRequired,
// };

export default MapWrapper;
