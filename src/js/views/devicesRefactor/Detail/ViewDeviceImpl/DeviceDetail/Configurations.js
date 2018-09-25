import React from 'react';
import PropTypes from 'prop-types';
import GenericList from './GenericList';

const Configurations = ({ attrs, device }) => (
    <GenericList
        img="images/gear-dark.png"
        attrs={attrs}
        box_title="Configurations"
        device={device}
    />
);

Configurations.defaultProps = {
    attrs: [],
};

Configurations.propTypes = {
    attrs: PropTypes.array,
    device: PropTypes.objectOf(PropTypes.shape({
        id: PropTypes.string,
    })).isRequired,
};

export default Configurations;
