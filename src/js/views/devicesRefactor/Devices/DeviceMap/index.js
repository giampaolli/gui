/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Sidebar from '../../../../components/DeviceRightSidebar';
import { Filter } from '../../../utils/Manipulation';
import { SmallPositionRenderer } from '../../../utils/Maps';
import { Loading } from '../../../../components/Loading';
import TrackingActions from '../../../../actions/TrackingActions';
import DeviceMapBig from './DeviceMapBig';
import DevFilterFields from './DevFilterFields';

class DeviceMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisplayList: true,
            filter: '',
            displayMap: {},
            selectedDevice: {},
            listOfDevices: [],
            mapquest: false,
        };

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

    countVisibleDevices() {
        let count = 0;
        for (const k in this.validDevices) {
            if (this.state.displayMap[this.validDevices[k].id]) count++;
        }
        return count;
    }

    componentDidMount() {
        this.showAll();
    }

    handleViewChange() {
        this.setState({ isDisplayList: !this.state.isDisplayList });
    }

    selectedDevice(device) {
        const selectedDevice = this.state.selectedDevice;
        if (selectedDevice.hasOwnProperty(device)) {
            selectedDevice[device] = !selectedDevice[device];
        } else {
            selectedDevice[device] = true;
        }
        this.setState({ selectedDevice });
    }

    toggleVisibility(device_id) {
        // console.log('toggleVisibility', device_id);
        const displayMap = this.state.displayMap;
        displayMap[device_id] = !displayMap[device_id];
        this.setState({ displayMap });
    }

    hideAll() {
        const displayMap = this.state.displayMap;
        for (const k in displayMap) {
            displayMap[k] = false;
        }
        this.setState({ displayMap });
    }

    showAll() {
        const displayMap = {};
        for (const k in this.props.devices) {
            displayMap[this.props.devices[k].id] = true;
        }
        this.setState({ displayMap });
    }

    applyFiltering(devices) {
        const list = [];
        for (const k in devices) {
            // if (this.state.displayMap[devices[k].id]) {
            list.push(devices[k]);
            // }
        }

        // if (this.state.displayMap)
        // {
        //     let displayMap = {};
        //     for (let k in devices) {
        //         displayMap[devices[k].id] = true;
        //     }
        //     this.setState({ displayMap: displayMap });
        // }
        return list;
    }

    toggleTracking(device_id) {
        if (!this.props.Measure.tracking.hasOwnProperty(device_id)) {
          for (const k in this.props.devices[device_id].attrs) {
            for (const j in this.props.devices[device_id].attrs[k]) {
              if (this.props.devices[device_id].attrs[k][j].value_type === "geo:point") {
                TrackingActions.fetch(device_id, this.props.devices[device_id].attrs[k][j].label);
                this.props.devices[device_id].tracking = true;
              }
            }
          }
        } else {
          TrackingActions.dismiss(device_id);
          this.props.devices[device_id].tracking = false;
        }
    }

    showSelected(device) {
        if (this.state.selectedDevice.hasOwnProperty(device)) {
            return this.state.selectedDevice[device];
        }
        return false;
    }

    // toggleDisplay(device) {
    //     let displayMap = this.state.displayMap;
    //     if (displayMap.hasOwnProperty(device)) {
    //         displayMap[device] = !displayMap[device];
    //     } else {
    //         displayMap[device] = false;
    //     }
    //     this.setState({displayMap: displayMap});
    // }

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
                            devices[k].position = parserPosition(devices[k].attrs[j][i].static_value);
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

    render() {
        this.validDevices = this.getDevicesWithPosition(this.props.devices);
        const filteredList = this.validDevices;
        // let filteredList = this.applyFiltering(this.validDevices);
        const nVisibleDevices = this.countVisibleDevices();
        const displayDevicesCount = `Showing ${nVisibleDevices} of ${this.validDevices.length} device(s)`;

        let pointList = [];
        for (const k in filteredList) {
            const device = filteredList[k];
            device.hasPosition = device.hasOwnProperty('position');
            if (this.props.Measure.tracking.hasOwnProperty(device.id) && this.state.displayMap[device.id]) {
                pointList = pointList.concat(this.props.Measure.tracking[device.id].map(
                  (e, k) => {
                    const updated = e;
                    updated.id = device.id;
                    updated.unique_key = `${device.id}_${k}`;
                    updated.label = device.label;
                    updated.timestamp = e.timestamp;
                    return updated;
                  }
                ));
            }
            if (this.state.displayMap[device.id]) pointList.push(device);
        }

        this.metaData = { alias: "device" };
        this.props.dev_opex.setFilterToMap();

        // let loading = <div className="row full-height relative">
        //     <div className="row full-height relative">
        //         <div className="background-info valign-wrapper full-height">
        //             <i className="fa fa-circle-o-notch fa-spin fa-fw horizontal-center" />
        //         </div>
        //     </div>
        // </div>;
        
        
        console.log("this.pointList", this.pointList);
        console.log("displayDevicesCount", displayDevicesCount);
    
        if (this.state.mapquest) {
          return <Loading />;
        }

        return <div className="fix-map-bug">
            <div className="flex-wrapper">
              <div className="map-filter-box">
                <Filter showPainel={this.props.showFilter} metaData={this.metaData} ops={this.props.dev_opex} fields={DevFilterFields} />
              </div>

              <div className="deviceMapCanvas deviceMapCanvas-map col m12 s12 relative">
                {/* <Script url="https://www.mapquestapi.com/sdk/leaflet/v2.s/mq-map.js?key=zvpeonXbjGkoRqVMtyQYCGVn4JQG8rd9" onLoad={this.mqLoaded} /> */}
                {this.pointList == undefined || this.pointList.length > 2000 ? <SmallPositionRenderer showLayersIcons={true} devices={pointList} toggleTracking={this.toggleTracking} allowContextMenu={true} listPositions={this.props.Measure.tracking} showPolyline={true} config={this.props.Config} /> : <DeviceMapBig devices={this.props.devices} showFilter={this.props.showFilter} dev_opex={this.props.dev_opex} config={this.props.Config} />}
                <Sidebar deviceInfo={displayDevicesCount} toggleVisibility={this.toggleVisibility} devices={this.validDevices} hideAll={this.hideAll} showAll={this.showAll} displayMap={this.state.displayMap} />
              </div>
            </div>
          </div>;
    }
}

// DeviceMap.defautProps = {
//     showFilter: false,
// };

// DeviceMap.propTypes = {
//     devices: PropTypes.array.isRequired,
//     Measure: PropTypes.object.isRequired,
//     devOpex: PropTypes.objectOf(PropTypes.shape({
//         whenUpdatePagination: PropTypes.func.isRequired,
//         setDefaultFilter: PropTypes.func.isRequired,
//         setFilterToMap: PropTypes.func.isRequired,
//         whenUpdateFilter: PropTypes.func.isRequired,
//         _fetch: PropTypes.func.isRequired,
//         setDefaultPageNumber: PropTypes.func.isRequired,
//         setDefaultPaginationParams: PropTypes.func.isRequired,
//         hasFilter: PropTypes.func.isRequired,
//         getCurrentQuery: PropTypes.func.isRequired,
//     })).isRequired,
//     showFilter: PropTypes.bool.isRequired,
//     Config: PropTypes.object.isRequired,
// };

export default DeviceMap;
