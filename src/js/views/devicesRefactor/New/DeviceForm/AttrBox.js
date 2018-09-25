/* eslint react/no-array-index-key: 0 */
import React from 'react';
import PropTypes from 'prop-types';

const AttrBox = ({ attrs }) => {
    const attrList = attrs.filter(attr => attr.type === 'dynamic');
    return (
        <div>
            {attrList.length > 0 ? (
                <div className="col s12">
                    {
                        attrList.map((attr, index) => (
                            <div key={index} className="col s4">
                                <div className="bg-gray">
                                    <div className="attr-name truncate">{attr.label}</div>
                                    <div className="attr-type">{attr.value_type}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            ) : null }
        </div>
    );
};

AttrBox.defaultProps = {
    attrs: [],
};

AttrBox.propTypes = {
    attrs: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value_type: PropTypes.string,
    })),
};

export default AttrBox;
