/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement"] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HandleGeoElements } from '../../../../../../components/HistoryElements';
import Attribute from './Attribute';
import DynamicAttributeList from './DynamicAttributeList';
import ActuatorsArea from './ActuatorsArea';

class DyAttributeArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAttributes: [],
            visibleAttributes: {},
            staticGeoAttrLabel: '',
        };

        this.toggleAttribute = this.toggleAttribute.bind(this);
    }

    componentWillMount() {
        const { device } = this.props;
        // Get static geo attr label
        for (const k in device.attrs) {
            for (const j in device.attrs[k]) {
                if (device.attrs[k][j].isGeo) {
                    if (device.attrs[k][j].type === 'static') {
                        this.setState({
                            staticGeoAttrLabel: device.attrs[k][j].label,
                        });
                    }
                }
            }
        }
    }

    toggleAttribute(attr) {
        let { selectedAttributes } = this.state;
        const { visibleAttributes } = this.state;
        if (visibleAttributes[attr.id]) {
            selectedAttributes = selectedAttributes.filter(i => i.id !== attr.id);
            delete visibleAttributes[attr.id];
        } else {
            selectedAttributes.push(attr);
            visibleAttributes[attr.id] = true;
        }

        // iterate over attrs
        this.setState({
            selectedAttributes,
            visibleAttributes,
        });
    }

    render() {
        const {
            attrs,
            openStaticMap,
            device,
            actuators,
        } = this.props;
        const { visibleAttributes, selectedAttributes, staticGeoAttrLabel } = this.state;
        for (const index in attrs) {
            if (visibleAttributes[attrs[index].id]) attrs[index].visible = true;
            else attrs[index].visible = false;
        }

        return (
            <div className="content-row">
                <div className="second-col">
                    {selectedAttributes.length === 0 && openStaticMap === false
                        ? (<div className="second-col-label center-align">Select an attribute to be displayed.</div>)
                        : null
                    }
                    {openStaticMap
                        ? (
                            <HandleGeoElements
                                device={device}
                                label={staticGeoAttrLabel}
                                isStatic
                            />
                        )
                        : null
                    }
                    {selectedAttributes.map(at => (
                        <Attribute key={at.id} device={device} attr={at} />
                    ))}
                </div>
                <div className="third-col">
                    <div className="row">
                        <DynamicAttributeList
                            device={device}
                            attrs={attrs}
                            changeAttr={this.toggleAttribute}
                        />
                    </div>
                    <div className="row">
                        <ActuatorsArea actuators={actuators} />
                    </div>
                </div>
            </div>
        );
    }
}

DyAttributeArea.propTypes = {
    attrs: PropTypes.array.isRequired,
    openStaticMap: PropTypes.bool.isRequired,
    device: PropTypes.objectOf(PropTypes.shape({
        id: PropTypes.string,
    })).isRequired,
    actuators: PropTypes.objectOf(PropTypes.shape({
        label: PropTypes.string,
    })).isRequired,
};

export default DyAttributeArea;
