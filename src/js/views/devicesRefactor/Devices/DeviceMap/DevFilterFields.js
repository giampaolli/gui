/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class DevFilterFields extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        console.log("DevFilterFields - DeviceMaps", this.props);
        return <div className="col s12 m12">
        <div className="col s5 m5">
            <div className="dev_field_filter">
                <label htmlFor="fld_device_name">Device Name</label>
                <input id="fld_device_name" type="text" className="form-control form-control-lg margin-top-mi7px" placeholder="Device Name" value={this.props.fields.label} name="label" onChange={this.props.onChange} />
            </div>
        </div>
        <div className="col s1 m1" />
        </div>;
    }
}

// DevFilterFields.propTypes = {
//     fields: PropTypes.objectOf(PropTypes.shape({
//         label: PropTypes.string,
//     })).isRequired,
//     onChange: PropTypes.func.isRequired,
// };

export default DevFilterFields;
