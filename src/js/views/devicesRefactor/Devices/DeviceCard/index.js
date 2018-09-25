/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement"] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loading } from '../../../../components/Loading';
import { Filter } from '../../../utils/Manipulation';
import DevFilterFields from './DevFilterFields';
import SummaryItem from './SumaryItem';

class DeviceCardList extends Component {
    constructor(props) {
        super(props);

        this.convertDeviceList = this.convertDeviceList.bind(this);
        this.filteredList = [];
    }

    convertDeviceList() {
        const { deviceList } = this.props;
        this.filteredList = [];
        for (const k in deviceList) {
            this.filteredList.push(deviceList[k]);
        }
    }

    render() {
        const { loading, showFilter, devOpex } = this.props;
        if (loading) {
            return <Loading />;
        }

        this.convertDeviceList();

        this.metaData = { alias: 'device' };
        devOpex.setDefaultFilter();

        return (
            <div className="device-card-area">
                <Filter
                    showPainel={showFilter}
                    metaData={this.metaData}
                    ops={devOpex}
                    fields={DevFilterFields}
                />
                {this.filteredList.length === 0 ? (
                    <div className="background-info valign-wrapper full-height">
                        <span className="horizontal-center">
                            {devOpex.hasFilter()
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

DeviceCardList.defaultProps = {
    loading: true,
    showFilter: false,
};

DeviceCardList.propTypes = {
    loading: PropTypes.bool,
    showFilter: PropTypes.bool,
    deviceList: PropTypes.array.isRequired,
    devOpex: PropTypes.objectOf(PropTypes.shape({
        whenUpdatePagination: PropTypes.func.isRequired,
        setDefaultFilter: PropTypes.func.isRequired,
        setFilterToMap: PropTypes.func.isRequired,
        whenUpdateFilter: PropTypes.func.isRequired,
        _fetch: PropTypes.func.isRequired,
        setDefaultPageNumber: PropTypes.func.isRequired,
        setDefaultPaginationParams: PropTypes.func.isRequired,
        hasFilter: PropTypes.func.isRequired,
        getCurrentQuery: PropTypes.func.isRequired,
    })).isRequired,
};

export default DeviceCardList;
