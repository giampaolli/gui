/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement"] */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialInput from '../../../../components/MaterialInput';

const StaticAttributes = ({ onChange, attrs }) => {
    const handleChange = (event) => {
        event.preventDefault();
        const f = event.target.name;
        const v = event.target.value;
        onChange(f, v);
    };

    if (!attrs.length) {
        return (
            <div />
        );
    }

    const statics = attrs.filter(item => String(item.type) === 'static');
    const properties = attrs.filter(item => String(item.type) === 'meta');

    for (const index in statics) {
        if (statics[index].value === undefined) {
            statics[index].value = statics[index].static_value;
        }
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
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
};

StaticAttributes.defaultProps = {
    attrs: [],
};

StaticAttributes.propTypes = {
    onChange: PropTypes.func.isRequired,
    attrs: PropTypes.arrayOf(),
};

export default StaticAttributes;
