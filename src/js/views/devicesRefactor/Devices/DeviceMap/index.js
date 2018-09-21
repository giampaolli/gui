/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement",
    "BinaryExpression[operator='in']"] */
/* eslint no-param-reassign: ["error"] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../../../../components/DeviceRightSidebar';
import { Filter } from '../../../utils/Manipulation';
import { SmallPositionRenderer } from '../../../utils/Maps';
import { Loading } from '../../../../components/Loading';
import TrackingActions from '../../../../actions/TrackingActions';
import DeviceMapBig from './DeviceMapBig';

class DeviceMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisplayList: true,
            displayMap: {},
            selectedDevice: {},
            mapquest: false,
        };

        this.list = [];
        this.validDevices = [];
        this.handleViewChange = this.handleViewChange.bind(this);
        this.applyFiltering = this.applyFiltering.bind(this);
        this.showSelected = this.showSelected.bind(this);
        this.selectedDevice = this.selectedDevice.bind(this);
        this.getDevicesWithPosition = this.getDevicesWithPosition.bind(this);

        this.toggleTracking = this.toggleTracking.bind(this);
        this.countVisibleDevices = this.countVisibleDevices.bind(this);

        this.showAll = this.showAll.bind(this);
        this.hideAll = this.hideAll.bind(this);
        // this.toggleDisplay = this.toggleDisplay.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    componentDidMount() {
        this.showAll();
    }

    getDevicesWithPosition(devices) {
        function parserPosition(position) {
            const parsedPosition = position.split(',');
            return [parseFloat(parsedPosition[0]), parseFloat(parsedPosition[1])];
        }

        const validDevices = [];
        for (const k in devices) {
            for (const j in devices[k].attrs) {
                for (const i in devices[k].attrs[j]) {
                    if (devices[k].attrs[j][i].type === 'static') {
                        if (devices[k].attrs[j][i].value_type === 'geo:point') {
                            devices[k].position = parserPosition(devices[k].attrs[j][i]
                                .static_value);
                        }
                    }
                }
            }

            devices[k].select = this.showSelected(k);
            if (devices[k].position !== null && devices[k].position !== undefined) {
                validDevices.push(devices[k]);
            }
        }
        return validDevices;
    }

    countVisibleDevices() {
        const { displayMap } = this.state;
        let count = 0;
        for (const k in this.validDevices) {
            if (displayMap[this.validDevices[k].id]) count += 1;
        }
        return count;
    }


    handleViewChange() {
        const { isDisplayList } = this.state;
        this.setState({ isDisplayList: !isDisplayList });
    }

    selectedDevice(device) {
        const { selectedDevice } = this.state;
        if (Object.prototype.hasOwnProperty.call(selectedDevice, device)) {
            selectedDevice[device] = !selectedDevice[device];
        } else {
            selectedDevice[device] = true;
        }
        this.setState({ selectedDevice });
    }

    toggleVisibility(deviceId) {
        const { displayMap } = this.state;
        // console.log('toggleVisibility', deviceId);
        displayMap[deviceId] = !displayMap[deviceId];
        this.setState({ displayMap });
    }

    hideAll() {
        const { displayMap } = this.state;
        for (const k in displayMap) {
            displayMap[k] = false;
        }
        this.setState({ displayMap });
    }

    showAll() {
        const { devices } = this.props;
        const displayMap = {};
        for (const k in devices) {
            displayMap[devices[k].id] = true;
        }
        this.setState({ displayMap });
    }

    applyFiltering(devices) {
        this.list = [];
        for (const k in devices) {
            this.list.push(devices[k]);
        }
        return this.list;
    }

    toggleTracking(deviceId) {
        const { Measure, devices } = this.props;
        if (!Measure.tracking.hasOwnProperty(deviceId)) {
            for (const k in devices[deviceId].attrs) {
                for (const j in devices[deviceId].attrs[k]) {
                    if (devices[deviceId].attrs[k][j].value_type === 'geo:point') {
                        TrackingActions.fetch(deviceId, devices[deviceId].attrs[k][j].label);
                        devices[deviceId].tracking = true;
                    }
                }
            }
        } else {
            TrackingActions.dismiss(deviceId);
            devices[deviceId].tracking = false;
        }
    }

    showSelected(device) {
        const { selectedDevice } = this.state;
        if (selectedDevice.hasOwnProperty(device)) {
            return selectedDevice[device];
        }
        return false;
    }

    renderComponent(pointList) {
        const {
            devices,
            Measure,
            showFilter,
            Config,
        } = this.props;

        if (pointList === undefined || pointList.length > 2000) {
            return (
                <SmallPositionRenderer
                    showLayersIcons
                    devices={pointList}
                    toggleTracking={this.toggleTracking}
                    allowContextMenu
                    listPositions={Measure.tracking}
                    showPolyline
                    config={Config}
                />
            );
        }

        return (
            <DeviceMapBig
                devices={devices}
                showFilter={showFilter}
                config={Config}
            />
        );
    }

    render() {
        const {
            devices,
            Measure,
            dev_opex,
            showFilter,
            DevFilterFields,
        } = this.props;

        const { displayMap, mapquest } = this.state;
        this.validDevices = this.getDevicesWithPosition(devices);
        const filteredList = this.validDevices;
        // let filteredList = this.applyFiltering(this.validDevices);
        const nVisibleDevices = this.countVisibleDevices();
        const displayDevicesCount = `Showing ${nVisibleDevices} of ${this.validDevices.length} device(s)`;

        let pointList = [];
        for (const k in filteredList) {
            const device = filteredList[k];
            device.hasPosition = device.hasOwnProperty('position');
            if (Measure.tracking.hasOwnProperty(device.id) && displayMap[device.id]) {
                pointList = pointList.concat(Measure.tracking[device.id].map(
                    (e, idx) => {
                        const updated = e;
                        updated.id = device.id;
                        updated.unique_key = `${device.id}_${idx}`;
                        updated.label = device.label;
                        updated.timestamp = e.timestamp;
                        return updated;
                    },
                ));
            }
            if (displayMap[device.id]) pointList.push(device);
        }

        this.metaData = { alias: 'device' };
        dev_opex.setFilterToMap();

        // console.log('this.pointList', this.pointList);
        // console.log('displayDevicesCount', displayDevicesCount);
        if (mapquest) {
            return <Loading />;
        }

        return (
            <div className="fix-map-bug">
                <div className="flex-wrapper">
                    <div className="map-filter-box">
                        <Filter
                            showPainel={showFilter}
                            metaData={this.metaData}
                            ops={dev_opex}
                            fields={DevFilterFields}
                        />
                    </div>
                    <div className="deviceMapCanvas deviceMapCanvas-map col m12 s12 relative">
                        {this.renderComponent(pointList)}
                        <Sidebar
                            deviceInfo={displayDevicesCount}
                            toggleVisibility={this.toggleVisibility}
                            devices={this.validDevices}
                            hideAll={this.hideAll}
                            showAll={this.showAll}
                            displayMap={displayMap}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

DeviceMap.propTypes = {
    devices: PropTypes.array.isRequired,
    Measure: PropTypes.object.isRequired,
    dev_opex: PropTypes.object.isRequired,
    showFilter: PropTypes.bool.isRequired,
    DevFilterFields: PropTypes.object.isRequired,
    Config: PropTypes.object.isRequired,
};

export default DeviceMap;
