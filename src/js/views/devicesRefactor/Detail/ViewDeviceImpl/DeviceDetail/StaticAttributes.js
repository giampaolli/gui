/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import GenericList from './GenericList';

class StaticAttributes extends Component {
    constructor(props) {
        super(props);

        this.openStaticMap = this.openStaticMap.bind(this);
    }

    openStaticMap(state) {
        this.props.openStaticMap(state);
    }

    render() {
        return (
            <div>
                <GenericList img="images/tag.png" attrs={this.props.attrs} box_title="Static Attributes" device={this.props.device} openStaticMap={this.openStaticMap} />
            </div>
        );
    }
}

// StaticAttributes.propTypes = {
//     openStaticMap: PropTypes.func.isRequired,
//     attrs: PropTypes.array.isRequired, 
//     device: PropTypes.object.isRequired,
// };

export default StaticAttributes;
