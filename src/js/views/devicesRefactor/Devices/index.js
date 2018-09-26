/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import DeviceStore from '../../../stores/DeviceStore';
import DeviceActions from '../../../actions/DeviceActions';
import MeasureActions from '../../../actions/MeasureActions';
import { NewPageHeader } from '../../../containers/full/PageHeader';
import util from '../../../comms/util';
import {
    Pagination, FilterLabel, GenericOperations,
} from '../../utils/Manipulation';
import DeviceCardList from './DeviceCard';
import MapWrapper from './MapWrapper';
import ToggleWidget from './ToggleWidget';
import OperationsHeader from './OperationsHeader';

class DeviceOperations extends GenericOperations {
    constructor() {
        super();
        this.filterParams = { sortBy: 'label' };
        this.paginationParams = {};
        this.setDefaultPaginationParams();
    }

    whenUpdatePagination(config) {
        for (const key in config) this.paginationParams[key] = config[key];
        this._fetch();
    }

    setDefaultFilter() {
        this.filterParams = { sortBy: 'label' };
        this.setDefaultPaginationParams();
    }

    setFilterToMap() {
        this.paginationParams = {
            page_size: 5000,
            page_num: 1,
        };
        this.filterParams = {};
    }

    whenUpdateFilter(config) {
        // this.setDefaultPageNumber();
        this.filterParams = config;
        this._fetch();
    }

    _fetch(cb = null) {
        const res = Object.assign({}, this.paginationParams, this.filterParams);
        if (this.filterParams.templates) {
            delete res.templates;
            res.template = this.filterParams.templates;
        }
        // console.log('fetching: ', res, 'all templates ');
        DeviceActions.fetchDevices.defer(res, cb);
    // }
    }
}


// TODO: this is an awful quick hack - this should be better scoped.
let device_list_socket = null;

class Devices extends Component {
    constructor(props) {
        super(props);
        this.state = { displayList: true, showFilter: false };

        this.toggleSearchBar = this.toggleSearchBar.bind(this);
        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.setDisplay = this.setDisplay.bind(this);
        this.dev_opex = new DeviceOperations();
    }

    componentDidMount() {
    // DeviceActions.fetchDevices.defer();
        // console.log('devices: componentDidMount');
        this.dev_opex._fetch();
        // Realtime
        const socketio = require('socket.io-client');

        const target = `${window.location.protocol}//${window.location.host}`;
        const token_url = `${target}/stream/socketio`;

        function _getWsToken() {
            util._runFetch(token_url)
                .then((reply) => {
                    init(reply.token);
                })
                .catch((error) => {
                    // console.log('Failed!', error);
                });
        }

        function init(token) {
            device_list_socket = socketio(target, { query: `token=${token}`, transports: ['polling'] });

            device_list_socket.on('all', (data) => {
                // console.log('received socket information:', data);
                MeasureActions.appendMeasures(data);
                DeviceActions.updateStatus(data);
            });

            device_list_socket.on('error', (data) => {
                // console.log('socket error', data);
                if (device_list_socket !== null) device_list_socket.close();
                // getWsToken();
            });
        }

        _getWsToken();
    }

    componentWillUnmount() {
        if (device_list_socket !== null) device_list_socket.close();
    }


    toggleSearchBar() {
        this.setState({ showFilter: !this.state.showFilter });
    }

    setDisplay(state) {
        this.setState({ displayList: state });
    }

    toggleDisplay() {
        const newDisplay = !this.state.displayList;
        // console.log(' toggleDisplay', newDisplay);
        // reload devices for maps
        if (!newDisplay) this.dev_opex.setFilterToMap();
        else this.dev_opex.setDefaultFilter();

        this.dev_opex._fetch(() => {
            this.setState({ displayList: newDisplay });
        });
    }


    render() {
        // console.log('Loading Devices Component.');

        const detail = 'detail' in this.props.location.query
            ? this.props.location.query.detail
            : null;
        const displayToggle = (
            <ToggleWidget
                toggleState={this.state.displayList}
                toggle={this.toggleDisplay}
                setState={this.setDisplay}
            />
        );

        const show_pagination = this.state.displayList;
        return (
            <div className="full-device-area">
                <AltContainer store={DeviceStore}>
                    <NewPageHeader title="Devices" subtitle="" icon="device">
                        <FilterLabel ops={this.dev_opex} text="Filtering Devices" />
                        <Pagination show_pagination={show_pagination} ops={this.dev_opex} />
                        <OperationsHeader displayToggle={displayToggle} toggleSearchBar={this.toggleSearchBar.bind(this)} />
                    </NewPageHeader>
                    {this.state.displayList ? <DeviceCardList deviceid={detail} toggle={displayToggle} dev_opex={this.dev_opex} showFilter={this.state.showFilter} /> : <MapWrapper deviceid={detail} toggle={displayToggle} showFilter={this.state.showFilter} dev_opex={this.dev_opex} />}
                </AltContainer>
            </div>
        );
    }
}

// Devices.propTypes = {
//     location: PropTypes.objectOf(PropTypes.shape({
//         query: PropTypes.object,
//     })).isRequired,
// };

export default Devices;
