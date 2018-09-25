/* eslint react/no-array-index-key: 0 */
import React from 'react';
import PropTypes from 'prop-types';

const AttrActuatorBox = ({ attrs }) => {
    const attrActuatorsList = attrs.filter(attr => attr.type === 'actuator');
    return (
        <div>
            {attrActuatorsList.length > 0 ? (
                <div className="col s12">
                    {
                        attrActuatorsList.map((attr, index) => (
                            <div key={index} className="col s4">
                                <div className="bg-gray">
                                    <div className="attr-name truncate">{attr.label}</div>
                                    <div className="attr-type">{attr.value_type}</div>
                                </div>
                            </div>
                        ))}
                </div>
            ) : null }
        </div>
    );
};

AttrActuatorBox.defaultProps = {
    attrs: [],
};

AttrActuatorBox.propTypes = {
    attrs: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value_type: PropTypes.string,
    })),
};

export default AttrActuatorBox;
