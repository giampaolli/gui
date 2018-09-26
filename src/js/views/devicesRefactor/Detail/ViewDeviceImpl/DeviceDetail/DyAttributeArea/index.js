/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { HandleGeoElements } from '../../../../../../components/HistoryElements';
import Attribute from './Attribute';
import DynamicAttributeList from './DynamicAttributeList';
import ActuatorsArea from './ActuatorsArea';

class DyAttributeArea extends Component {
    constructor(props) {
        super(props);
        this.state = { selected_attributes: [], visible_attributes: {}, static_geo_attr_label: '' };
        this.toggleAttribute = this.toggleAttribute.bind(this);
    }

    componentWillMount() {
    // Get static geo attr label
        for (const k in this.props.device.attrs) {
            for (const j in this.props.device.attrs[k]) {
                if (this.props.device.attrs[k][j].isGeo) {
                    if (this.props.device.attrs[k][j].type == 'static') {
                        this.setState({ static_geo_attr_label: this.props.device.attrs[k][j].label });
                    }
                }
            }
        }
    }

    toggleAttribute(attr) {
        let sa = this.state.selected_attributes;
        const current_attrs = this.state.visible_attributes;
        if (current_attrs[attr.id]) {
            sa = sa.filter(i => i.id !== attr.id);
            delete current_attrs[attr.id];
        } else {
            sa.push(attr);
            current_attrs[attr.id] = true;
        }

        // iterate over attrs
        this.setState({
            selected_attributes: sa,
            visible_attributes: current_attrs,
        });
    }

    render() {
        const lista = this.props.attrs;
        for (const index in lista) {
            if (this.state.visible_attributes[lista[index].id]) lista[index].visible = true;
            else lista[index].visible = false;
        }

        return (
            <div className="content-row">
                <div className="second-col">
                    {this.state.selected_attributes.length == 0 && this.props.openStaticMap == false
                        ? (<div className="second-col-label center-align">Select an attribute to be displayed.</div>)
                        : null
                    }
                    {this.props.openStaticMap ? <HandleGeoElements device={this.props.device} label={this.state.static_geo_attr_label} isStatic /> : null}
                    {this.state.selected_attributes.map(at => (
                        <Attribute key={at.id} device={this.props.device} attr={at} />
                    ))}
                </div>
                <div className="third-col">
                    <div className="row">
                        <DynamicAttributeList device={this.props.device} attrs={lista} change_attr={this.toggleAttribute} />
                    </div>
                    <div className="row">
                        <ActuatorsArea actuators={this.props.actuators} />
                    </div>
                </div>
            </div>
        );
    }
}

// DyAttributeArea.propTypes = {
//     attrs: PropTypes.array.isRequired,
//     openStaticMap: PropTypes.bool.isRequired,
//     device: PropTypes.objectOf(PropTypes.shape({
//         id: PropTypes.string,
//     })).isRequired,
//     actuators: PropTypes.objectOf(PropTypes.shape({
//         label: PropTypes.string,
//     })).isRequired,
// };

export default DyAttributeArea;
