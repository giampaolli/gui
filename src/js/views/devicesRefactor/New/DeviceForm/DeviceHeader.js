/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import MaterialInput from '../../../../components/MaterialInput';

class DeviceHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col s12 pb20">
                <div className="col s3">
                    <div className="img">
                        <img src="images/big-chip.png" />
                    </div>
                </div>
                <div className="col s9 pt20px">
                    <div>
                        <div className="input-field large col s12 ">
                            <MaterialInput id="fld_label" value={this.props.name} name="label" onChange={this.props.onChange} maxLength={40}> Name </MaterialInput>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// DeviceHeader.propTypes = {
//     name: PropTypes.string.isRequired,
//     onChange: PropTypes.func.isRequired,
// };

export default DeviceHeader;
