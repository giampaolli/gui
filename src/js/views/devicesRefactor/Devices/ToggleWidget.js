/* eslint-disable */
import React from 'react';
// import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Toggle from 'material-ui/Toggle';

// UI elements
function ToggleWidget(props) {
    function checkAndToggle(currentState) {
        if (props.toggleState == currentState) props.toggle();
    }

    return (
        <div className="box-sh">
            <div className="toggle-icon" onClick={checkAndToggle.bind(this, true)}>
                <img src="images/icons/pin.png" />
            </div>
            <div className="toggle-map">
                <MuiThemeProvider>
                    <Toggle label="" defaultToggled={props.toggleState} onToggle={props.toggle} />
                </MuiThemeProvider>
            </div>
            <div className="toggle-icon" onClick={checkAndToggle.bind(this, false)}>
                <i className="fa fa-th-large" aria-hidden="true" />
            </div>
        </div>
    );
}

// ToggleWidget.propTypes = {
//     toggleState: PropTypes.bool.isRequired,
//     toggle: PropTypes.func.isRequired,
// };

export default ToggleWidget;
