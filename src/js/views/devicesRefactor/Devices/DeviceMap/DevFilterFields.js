import React from 'react';
import PropTypes from 'prop-types';

const DevFilterFields = ({ fields, onChange }) => (
    <div className="col s12 m12">
        <div className="col s5 m5">
            <div className="dev_field_filter">
                <label htmlFor="fld_device_name">
                    Device Name
                    <input
                        id="fld_device_name"
                        type="text"
                        className="form-control form-control-lg margin-top-mi7px"
                        placeholder="Device Name"
                        value={fields.label}
                        name="label"
                        onChange={onChange}
                    />
                </label>
            </div>
        </div>
        <div className="col s1 m1" />
    </div>
);

DevFilterFields.propTypes = {
    fields: PropTypes.objectOf(PropTypes.shape({
        label: PropTypes.string,
    })).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default DevFilterFields;
