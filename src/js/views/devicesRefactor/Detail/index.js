/* global window */
/* eslint no-underscore-dangle:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import MeasureActions from '../../../actions/MeasureActions';
import DeviceActions from '../../../actions/DeviceActions';
import DeviceStore from '../../../stores/DeviceStore';
import util from '../../../comms/util/util';
import ViewDeviceImpl from './ViewDeviceImpl';

// Realtime
const socketio = require('socket.io-client');

class ViewDevice extends Component {
    constructor(props) {
        super(props);
        this.deviceDetailSocket = null;
    }

    componentWillMount() {
        const { params } = this.props;
        DeviceActions.fetchSingle.defer(params.device);
    }

    componentDidMount() {
        const target = `${window.location.protocol}//${window.location.host}`;
        const tokenUrl = `${target}/stream/socketio`;

        function init(token) {
            this.deviceDetailSocket = socketio(target, { query: `token=${token}`, transports: ['polling'] });

            this.deviceDetailSocket.on('all', (data) => {
                MeasureActions.appendMeasures(data);
            });

            // console.log('socket error', data);
            this.deviceDetailSocket.on('error', () => {
                if (this.deviceDetailSocket) this.deviceDetailSocket.close();
                // getWsToken();
            });
        }

        function getWsToken() {
            util._runFetch(tokenUrl)
                .then((reply) => {
                    init(reply.token);
                })
                .catch((error) => {
                    console.log('Failed!', error);
                });
        }


        getWsToken();
    }

    componentWillUnmount() {
        if (this.deviceDetailSocket) this.deviceDetailSocket.close();
    }

    render() {
        const { params } = this.props;
        return (
            <div className="full-width full-height">
                <AltContainer store={DeviceStore}>
                    <ViewDeviceImpl deviceId={params.device} />
                </AltContainer>
            </div>
        );
    }
}

ViewDevice.propTypes = {
    params: PropTypes.objectOf(PropTypes.shape({
        device: PropTypes.object,
    })).isRequired,
};

export default ViewDevice;
