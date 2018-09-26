/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { BigPositionRenderer } from '../../../utils/Maps';

class DeviceMapBig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            corners: { topLeft: 100, topRight: 100, bottomLeft: 0, bottomRight: 0 },
            zoom: 18
        };
        // this.splitInClusters = this.splitInClusters.bind(this);
        this.handleGeoDevices = this.handleGeoDevices.bind(this);
        this.markerList = [];
        this.clusterers = {};
    }
    componentDidMount() {
        console.log("DeviceMapBig: componentDidMount, props: ", this.props);
    }
    //   splitInClusters()
    //   {
    //       let markers = this.markerList;
    //       console.log("splitInClusters", markers);
    //         let clusterers = {};
    //         let numberof = (markers.length%20000);
    //         for (let index = 0; index < numberof; index++)
    //         {
    //             clusterers[index] = markers.slice(index, index*numberof);
    //         }
    //         return clusterers;
    //  }
    handleGeoDevices() {
        console.log("DeviceMapBig: handleGeoDevices", this.props);
        this.clusterers = [];
        // step 1. Create elements to set on markers
        this.props.clusterers.map((element, i1) => {
            let clstr = { index: i1, devices: [] };
            element.devices.map((element, index) => {
                console.log("element.geo.lat", element.geo);
                if (element.geo !== undefined) {
                    clstr.devices.push({
                        id: element.id,
                        lat: element.geo.lat,
                        lng: element.geo.lng,
                        pos: [
                            parseFloat("-23.5373"),
                            parseFloat("-46.6293")
                        ],
                        label: element.label,
                        timestamp: element.timestamp,
                        key: element.id
                    });
                }
            });
            this.clusterers.push(clstr);
        });
        console.log("this.clusterers", this.clusterers);
        // this.clusterers = this.splitInClusters();
    }
    render() {
        this.handleGeoDevices();
        let displayDevicesCount = "Showing " + filteredList.length + " device(s)";
        return (
            <BigPositionRenderer showLayersIcons={true}
                config={this.props.Config}
                devices={this.props.devices}
                allowContextMenu={true}
                // positions={this.markerList}
                clusterers={this.clusterers}
            />
        );
    }
}

// DeviceMapBig.propTypes = {
//     clusterers: PropTypes.array.isRequired,
//     devices: PropTypes.array.isRequired,
//     Config: PropTypes.array.isRequired,
// };

export default DeviceMapBig;
