/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import AttrHistory from './AttrHistory';

class Attribute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: false,
        };
        this.toogleExpand = this.toogleExpand.bind(this);
    }

    componentDidMount() {
    //  MeasureActions.fetchMeasure(this.props.device, this.props.device.id, this.props.device.templates, this.props.attr.id, 250);
    }

    toogleExpand(state) {
        this.setState({ opened: state });
    }

    render() {
    // check the current window, if less then 1024px, blocks compressed state
        const width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
        let opened = this.state.opened;
        if (width < 1168) opened = true;

        return (
            <div className={`attributeBox ${opened ? 'expanded' : 'compressed'}`}>
                <div className="header">
                    <label>{this.props.attr.label}</label>
                    {!opened ? <i onClick={this.toogleExpand.bind(this, true)} className="fa fa-expand" /> : <i onClick={this.toogleExpand.bind(this, false)} className="fa fa-compress" />}
                </div>

                {/* <AttributeBox attrs={this.state.selected_attributes} /> */}
                <div className="details-card-content">
                    <AttrHistory device={this.props.device} type={this.props.attr.value_type} attr={this.props.attr.label} />
                </div>
            </div>
        );
    }
}

// Attribute.propTypes = {
//     device: PropTypes.objectOf(PropTypes.shape({
//         id: PropTypes.string,
//     })).isRequired,
//     attr: PropTypes.array.isRequired,
// };

export default Attribute;
