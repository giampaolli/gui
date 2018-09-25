/* global window */
/* eslint global-require : 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement"] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Toggle from 'material-ui/Toggle';
import DeviceStore from '../../../stores/DeviceStore';
import DeviceActions from '../../../actions/DeviceActions';
import MeasureActions from '../../../actions/MeasureActions';
import { NewPageHeader } from '../../../containers/full/PageHeader';
import { DojotBtnLink } from '../../../components/DojotButton';
import util from '../../../comms/util';
import DeviceCardList from './DeviceCard';
import MapWrapper from './MapWrapper';
import {
    Pagination, FilterLabel, GenericOperations,
} from '../../utils/Manipulation';


// UI elements
function ToggleWidget({ toggleState, toggle }) {
    function checkAndToggle(currentState) {
        if (toggleState === currentState) toggle();
    }

    return (
        <div className="box-sh">
            <div
                role="button"
                tabIndex="0"
                className="toggle-icon"
                onClick={checkAndToggle.bind(this, true)}
                onKeyPress={checkAndToggle.bind(this, true)}
            >
                <img src="images/icons/pin.png" alt="pin" />
            </div>
            <div className="toggle-map">
                <MuiThemeProvider>
                    <Toggle label="" defaultToggled={toggleState} onToggle={toggle} />
                </MuiThemeProvider>
            </div>
            <div
                role="button"
                tabIndex="0"
                className="toggle-icon"
                onClick={checkAndToggle.bind(this, false)}
                onKeyPress={checkAndToggle.bind(this, false)}
            >
                <i className="fa fa-th-large" aria-hidden="true" />
            </div>
        </div>
    );
}

ToggleWidget.propTypes = {
    toggleState: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
};


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
function OperationsHeader({ displayToggle, toggleSearchBar }) {
    return (
        <div className="col s5 pull-right pt10">
            <div
                role="button"
                tabIndex="0"
                className="searchBtn"
                title="Show search bar"
                onClick={toggleSearchBar}
                onKeyPress={toggleSearchBar}
            >
                <i className="fa fa-search" />
            </div>
            {displayToggle}
            <DojotBtnLink
                linkto="/device/new"
                label="New Device"
                alt="Create a new device"
                icon="fa fa-plus"
                className="w130px"
            />
        </div>
    );
}

OperationsHeader.propTypes = {
    displayToggle: PropTypes.func.isRequired,
    toggleSearchBar: PropTypes.func.isRequired,
};

let deviceListSocket = null;

class Devices extends Component {
    constructor(props) {
        super(props);
        this.state = { displayList: true, showFilter: false };

        this.toggleSearchBar = this.toggleSearchBar.bind(this);
        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.setDisplay = this.setDisplay.bind(this);
        this.devOpex = new DeviceOperations();
    }

    componentDidMount() {
        this.devOpex._fetch();
        // Realtime
        const socketio = require('socket.io-client');

        const target = `${window.location.protocol}//${window.location.host}`;
        const tokenUrl = `${target}/stream/socketio`;

        function init(token) {
            deviceListSocket = socketio(target, { query: `token=${token}`, transports: ['polling'] });

            deviceListSocket.on('all', (data) => {
                MeasureActions.appendMeasures(data);
                DeviceActions.updateStatus(data);
            });

            deviceListSocket.on('error', () => {
                if (deviceListSocket !== null) deviceListSocket.close();
            });
        }

        function _getWsToken() {
            util._runFetch(tokenUrl)
                .then((reply) => {
                    init(reply.token);
                })
                .catch(() => {
                    // console.log('Failed!', error);
                });
        }

        _getWsToken();
    }

    componentWillUnmount() {
        if (deviceListSocket !== null) deviceListSocket.close();
    }

    setDisplay(state) {
        this.setState({ displayList: state });
    }

    toggleSearchBar() {
        let { showFilter } = this.state;
        showFilter = !showFilter;
        this.setState({ showFilter });
    }

    toggleDisplay() {
        let { displayList } = this.state;
        displayList = !displayList;
        if (!displayList) this.devOpex.setFilterToMap();
        else this.devOpex.setDefaultFilter();

        this.devOpex._fetch(() => {
            this.setState({ displayList });
        });
    }


    render() {
        const { displayList, showFilter } = this.state;
        const { location } = this.props;

        const detail = 'detail' in location.query
            ? location.query.detail
            : null;
        const displayToggle = (
            <ToggleWidget
                toggleState={displayList}
                toggle={this.toggleDisplay}
                setState={this.setDisplay}
            />
        );

        const showPagination = displayList;
        return (
            <div className="full-device-area">
                <AltContainer store={DeviceStore}>
                    <NewPageHeader title="Devices" subtitle="" icon="device">
                        <FilterLabel ops={this.devOpex} text="Filtering Devices" />
                        <Pagination show_pagination={showPagination} ops={this.devOpex} />
                        <OperationsHeader
                            displayToggle={displayToggle}
                            toggleSearchBar={this.toggleSearchBar}
                        />
                    </NewPageHeader>
                    {displayList
                        ? (
                            <DeviceCardList
                                deviceid={detail}
                                toggle={displayToggle}
                                devOpex={this.devOpex}
                                showFilter={showFilter}
                            />
                        )
                        : (
                            <MapWrapper
                                deviceid={detail}
                                toggle={displayToggle}
                                showFilter={showFilter}
                                devOpex={this.devOpex}
                            />
                        )
                    }
                </AltContainer>
            </div>
        );
    }
}

Devices.propTypes = {
    location: PropTypes.objectOf(PropTypes.shape({
        query: PropTypes.object,
    })).isRequired,
};

export default Devices;
