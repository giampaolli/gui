/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import GenericList from './GenericList';

class Configurations extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <GenericList img="images/gear-dark.png" attrs={this.props.attrs} box_title="Configurations" device={this.props.device} />
            </div>
        );
    }
}

// Configurations.defaultProps = {
//     attrs: [],
// };

// Configurations.propTypes = {
//     attrs: PropTypes.array,
//     device: PropTypes.objectOf(PropTypes.shape({
//         id: PropTypes.string,
//     })).isRequired,
// };

export default Configurations;
