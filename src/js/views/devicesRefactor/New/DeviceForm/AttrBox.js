/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class AttrBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const attr_list = this.props.attrs.filter(attr => attr.type == 'dynamic');

        // console.log('attr_list', attr_list);
        return (
            <div>
                {attr_list.length > 0 ? (
                    <div className="col s12">
                        {
                            attr_list.map((attr, index) => (
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
    }
}

// AttrBox.defaultProps = {
//     attrs: [],
// };

// AttrBox.propTypes = {
//     attrs: PropTypes.arrayOf(PropTypes.shape({
//         label: PropTypes.string,
//         value_type: PropTypes.string,
//     })),
// };

export default AttrBox;
