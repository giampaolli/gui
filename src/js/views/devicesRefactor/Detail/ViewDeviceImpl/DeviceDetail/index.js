/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement"] */
/* eslint no-param-reassign: ["error", { "props": false }] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Configurations from './Configurations';
import StaticAttributes from './StaticAttributes';
import DyAttributeArea from './DyAttributeArea';

class DeviceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openStaticMap: false,
        };

        this.handleOpenStaticMap = this.handleOpenStaticMap.bind(this);
    }

    handleOpenStaticMap(state) {
        this.setState({ openStaticMap: state });
    }

    render() {
        const { device } = this.props;
        const { openStaticMap } = this.state;
        let attrList = [];
        let dal = [];
        let actuators = [];
        let configList = [];

        for (const index in device.attrs) {
            let tmp = device.attrs[index];
            if (!Array.isArray(tmp)) {
                tmp = device.attrs;
            }

            attrList = attrList.concat(tmp.filter(i => String(i.type) === 'static'));
            dal = dal.concat(tmp.filter((i) => {
                i.visible = false;
                return String(i.type) === 'dynamic';
            }));
            actuators = actuators.concat(tmp.filter((i) => {
                i.visible = false;
                return String(i.type) === 'actuator';
            }));
            configList = configList.concat(tmp.filter(i => String(i.type) === 'meta'));
        }

        for (const index in configList) {
            if (configList[index].label === 'protocol') {
                configList[index].static_value = configList[index].static_value.toUpperCase();
            }
        }

        return (
            <div className="row detail-body">
                <div className="first-col">
                    <Configurations
                        device={device}
                        attrs={configList}
                    />
                    <StaticAttributes
                        device={device}
                        attrs={attrList}
                        openStaticMap={this.handleOpenStaticMap}
                    />
                </div>
                <DyAttributeArea
                    device={device}
                    actuators={actuators}
                    attrs={dal}
                    openStaticMap={openStaticMap}
                />
            </div>
        );
    }
}

DeviceDetail.propTypes = {
    device: PropTypes.object.isRequired,
};

export default DeviceDetail;
