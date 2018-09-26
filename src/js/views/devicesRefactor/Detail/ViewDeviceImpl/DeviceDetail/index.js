/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Configurations from './Configurations';
import StaticAttributes from './StaticAttributes';
import DyAttributeArea from './DyAttributeArea';

class DeviceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { openStaticMap: false };

        this.openStaticMap = this.openStaticMap.bind(this);
    }

    openStaticMap(state) {
        this.setState({ openStaticMap: state });
    }

    render() {
        let attr_list = [];
        let dal = [];
        let actuators = [];
        let config_list = [];
        for (const index in this.props.device.attrs) {
            let tmp = this.props.device.attrs[index];
            if (!Array.isArray(tmp))
                tmp = this.props.device.attrs;

            attr_list = attr_list.concat(tmp.filter(i => String(i.type) === 'static'));
            dal = dal.concat(tmp.filter((i) => {
                i.visible = false;
                return String(i.type) === 'dynamic';
            }));
            actuators = actuators.concat(tmp.filter((i) => {
                i.visible = false;
                return String(i.type) === 'actuator';
            }));
            config_list = config_list.concat(tmp.filter(i => String(i.type) === 'meta'));
        }

        for (const index in config_list) {
            if (config_list[index].label === 'protocol') {
                config_list[index].static_value = config_list[index].static_value.toUpperCase();
            }
        }

        // console.log('attrs: ', dal);
        return (
            <div className="row detail-body">
                <div className="first-col">
                    <Configurations device={this.props.device} attrs={config_list} />
                    <StaticAttributes device={this.props.device} attrs={attr_list} openStaticMap={this.openStaticMap} />
                </div>
                <DyAttributeArea device={this.props.device} actuators={actuators} attrs={dal} openStaticMap={this.state.openStaticMap} />
            </div>
        );
    }
}

// DeviceDetail.propTypes = {
//     device: PropTypes.object.isRequired,
// };

export default DeviceDetail;
