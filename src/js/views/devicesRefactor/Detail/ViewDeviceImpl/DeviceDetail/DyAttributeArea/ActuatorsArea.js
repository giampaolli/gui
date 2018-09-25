/* eslint jsx-a11y/label-has-associated-control: 0 */
import React from 'react';
import Proptypes from 'prop-types';

const ActuatorsArea = ({ actuators }) => (
    <div className=" dy_attributes">
        <div className="col s12 header">
            <div className="col s2" />
            <label className="col s8">Actuators</label>
        </div>
        <div className="col s12 body">
            {actuators.map(actuator => (
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

ActuatorsArea.propTypes = {
    actuators: Proptypes.arrayOf(Proptypes.shape({
        label: Proptypes.string,
    })).isRequired,
};

export default ActuatorsArea;
