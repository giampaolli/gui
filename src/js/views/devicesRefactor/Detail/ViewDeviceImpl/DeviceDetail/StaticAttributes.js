import React from 'react';
import PropTypes from 'prop-types';
import GenericList from './GenericList';

const StaticAttributes = ({ openStaticMap, attrs, device }) => (
    <div>
        <GenericList
            img="images/tag.png"
            attrs={attrs}
            box_title="Static Attributes"
            device={device}
            openStaticMap={state => openStaticMap(state)}
        />
    </div>
);

StaticAttributes.propTypes = {
    openStaticMap: PropTypes.func.isRequired,
    attrs: PropTypes.array.isRequired, 
    device: PropTypes.object.isRequired,
};

export default StaticAttributes;
