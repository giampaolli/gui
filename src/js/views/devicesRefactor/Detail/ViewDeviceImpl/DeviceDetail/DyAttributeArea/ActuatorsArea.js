/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class ActuatorsArea extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className=" dy_attributes">
                <div className="col s12 header">
                    <div className="col s2" />
                    <label className="col s8">Actuators</label>
                </div>
                <div className="col s12 body">
                    {this.props.actuators.map(actuator => (
                        <div key={actuator.label} className="line">
                            <div className="col offset-s2 s8">
                                <div className="label truncate" title={actuator.label}>{actuator.label}</div>
                                {/* <div className="value-label">{attr.value_type}</div> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

// ActuatorsArea.propTypes = {
//     actuators: PropTypes.arrayOf(PropTypes.shape({
//         label: PropTypes.string,
//     })).isRequired,
// };

export default ActuatorsArea;
