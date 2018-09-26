/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import MeasureActions from '../../../actions/MeasureActions';
import DeviceActions from '../../../actions/DeviceActions';
import DeviceStore from '../../../stores/DeviceStore';
import util from '../../../comms/util/util';
import ViewDeviceImpl from './ViewDeviceImpl';

// TODO: this is an awful quick hack - this should be better scoped.
let device_detail_socket = null;

class ViewDevice extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        DeviceActions.fetchSingle.defer(this.props.params.device);
    }

    componentDidMount() {
        // Realtime
        const socketio = require('socket.io-client');

        const target = `${window.location.protocol}//${window.location.host}`;
        const token_url = `${target}/stream/socketio`;

        function getWsToken() {
            util._runFetch(token_url)
                .then((reply) => {
                    init(reply.token);
                })
                .catch((error) => {
                    // console.log('Failed!', error);
                });
        }

        function init(token) {
            device_detail_socket = socketio(target, { query: `token=${token}`, transports: ['polling'] });

            device_detail_socket.on('all', (data) => {
                MeasureActions.appendMeasures(data);
            });

            // console.log('socket error', data);
                device_detail_socket.on('error', (data) => {
                if (device_detail_socket) device_detail_socket.close();
                // getWsToken();
            });
        }

        getWsToken();
    }

    componentWillUnmount() {
        if (device_detail_socket) device_detail_socket.close();
    }

    render() {
        return (
            <div className="full-width full-height">
                <AltContainer store={DeviceStore}>
                    <ViewDeviceImpl device_id={this.props.params.device} />
                </AltContainer>
            </div>
        );
    }
}

// ViewDevice.propTypes = {
//     params: PropTypes.objectOf(PropTypes.shape({
//         device: PropTypes.object,
//     })).isRequired,
// };

export default ViewDevice;
