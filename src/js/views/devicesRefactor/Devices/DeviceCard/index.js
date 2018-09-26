/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Loading } from '../../../../components/Loading';
import { Filter } from '../../../utils/Manipulation';
import DevFilterFields from './DevFilterFields';
import SummaryItem from './SumaryItem';

class DeviceCardList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        };
        this.convertDeviceList = this.convertDeviceList.bind(this);
        this.filteredList = [];
    }

    convertDeviceList() {
        this.filteredList = [];
        for (const k in this.props.deviceList) {
            this.filteredList.push(this.props.deviceList[k]);
        }
    }

    render() {
        if (this.props.loading) {
            return <Loading />;
        }

        this.convertDeviceList();

        this.metaData = { alias: 'device' };
        this.props.dev_opex.setDefaultFilter();

        return (
            <div className="device-card-area">
                <Filter showPainel={this.props.showFilter} metaData={this.metaData} ops={this.props.dev_opex} fields={DevFilterFields} />
                {this.filteredList.length === 0 ? (
                    <div className="background-info valign-wrapper full-height">
                        <span className="horizontal-center">
                            {this.props.dev_opex.hasFilter()
                                ? <b className="noBold">No devices to be shown</b>
                                : <b className="noBold">No configured devices</b>
                            }
                        </span>
                    </div>
                ) : (
                    <div className="col s12  lst-wrapper extra-padding">
                        {this.filteredList.map(device => (
                            <SummaryItem device={device} key={device.id} />
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

// DeviceCardList.defaultProps = {
//     loading: true,
//     showFilter: false,
// };

// DeviceCardList.propTypes = {
//     loading: PropTypes.bool,
//     showFilter: PropTypes.bool,
//     deviceList: PropTypes.array.isRequired,
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
// };

export default DeviceCardList;
