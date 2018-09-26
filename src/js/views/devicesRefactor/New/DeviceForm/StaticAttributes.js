/* eslint-disable */ 
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import MaterialInput from '../../../../components/MaterialInput';

class StaticAttributes extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
        const f = event.target.name;
        const v = event.target.value;
        this.props.onChange(f, v);
    }

    render() {
        if (!this.props.attrs.length) {
            return (
                <div />
            );
        }

        let statics = this.props.attrs.filter(item => String(item.type) == 'static');
        const properties = this.props.attrs.filter(item => String(item.type) == 'meta');

        for (let index in statics) {
            if (statics[index].value == undefined)
              statics[index].value = statics[index].static_value;
        }

        for (const index in properties) {
            if (properties[index].label === 'protocol') {
                properties[index].static_value = properties[index].static_value.toUpperCase();
                properties[index].value = properties[index].value.toUpperCase();
            }
        }

        return (
            <div className="attr-box specific-attr">
                {properties.length > 0 && (
                    <div className="col s12">
                        <div className="col s12">
                            <div className="attr-title">Configurations</div>
                        </div>
                        <div className="col s12 bg-gray">
                            {properties.map(attr => (
                                <div key={attr.label} className="col s6 attr-fields">
                                    <div className="attr-name truncate">{attr.label}</div>
                                    <div className="attr-type">{attr.value_type}</div>
                                    <div className="attr-name input-field fix-inputs">
                                        <MaterialInput
                                            className="mt0px"
                                            id="fld_label"
                                            value={attr.value}
                                            name={attr.label}
                                            onChange={this.handleChange}
                                            maxLength={40}
                                        />
                                    </div>
                                    <div className="attr-type fix-value ">Value</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {statics.length > 0 && (
                    <div className="col s12">
                        <div className="col s12">
                            <div className="attr-title">Static Attributes</div>
                        </div>
                        <div className="col s12 bg-gray">
                            {statics.map(attr => (
                                <div key={attr.label} className="col s6 attr-fields">
                                    <div className="attr-name truncate">{attr.label}</div>
                                    <div className="attr-type">{attr.value_type}</div>
                                    <div className="attr-name input-field fix-inputs">
                                        <MaterialInput
                                            className="mt0px"
                                            id="fld_label"
                                            value={attr.value}
                                            name={attr.label}
                                            onChange={this.handleChange}
                                            maxLength={40}
                                        />
                                    </div>
                                    <div className="attr-type fix-value ">Value</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

// StaticAttributes.defaultProps = {
//     attrs: [],
// };

// StaticAttributes.propTypes = {
//     onChange: PropTypes.func.isRequired,
//     attrs: PropTypes.arrayOf(),
// };

export default StaticAttributes;
