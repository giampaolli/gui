/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement",
    "BinaryExpression[operator='in']"] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import ConfigStore from '../../../stores/ConfigStore';
import MeasureStore from '../../../stores/MeasureStore';
import MeasureActions from '../../../actions/MeasureActions';
import DeviceMap from './DeviceMap';

class MapWrapper extends Component {
    componentDidMount() {
        const { devices } = this.props;
        for (const deviceID in devices) {
            for (const templateID in devices[deviceID].attrs) {
                for (const attrID in devices[deviceID].attrs[templateID]) {
                    if (devices[deviceID].attrs[templateID][attrID].type === 'dynamic') {
                        if (devices[deviceID].attrs[templateID][attrID].value_type === 'geo:point') {
                            MeasureActions.fetchPosition.defer(devices[deviceID],
                                devices[deviceID].id,
                                devices[deviceID].attrs[templateID][attrID].label);
                        }
                    }
                }
            }
        }
    }

    render() {
        const { devices, showFilter, devOpex } = this.props;
        return (
            <AltContainer stores={{ Measure: MeasureStore, Config: ConfigStore }}>
                <DeviceMap devices={devices} showFilter={showFilter} devOpex={devOpex} />
            </AltContainer>
        );
    }
}

MapWrapper.propTypes = {
    devices: PropTypes.arrayOf.isRequired,
    showFilter: PropTypes.func.isRequired,
    devOpex: PropTypes.func.isRequired,
};

export default MapWrapper;
