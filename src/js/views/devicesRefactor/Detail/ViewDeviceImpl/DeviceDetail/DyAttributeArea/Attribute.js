/* global window */
/* global document */
/* eslint jsx-a11y/label-has-associated-control: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AttrHistory from './AttrHistory';

class Attribute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: false,
        };
        this.toogleExpand = this.toogleExpand.bind(this);
    }

    toogleExpand(state) {
        this.setState({ opened: state });
    }

    render() {
        // check the current window, if less then 1024px, blocks compressed state
        let { opened } = this.state;
        const { attr, device } = this.props;
        const width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        if (width < 1168) opened = true;
        return (
            <div className={`attributeBox ${opened ? 'expanded' : 'compressed'}`}>
                <div className="header">
                    <label>{attr.label}</label>
                    {!opened
                        ? (
                            <i
                                role="button"
                                tabIndex="0"
                                onKeyPress={this.toogleExpand.bind(this, true)}
                                onClick={this.toogleExpand.bind(this, true)}
                                className="fa fa-expand"
                            />
                        )
                        : (
                            <i
                                role="button"
                                tabIndex="0"
                                onKeyPress={this.toogleExpand.bind(this, true)}
                                onClick={this.toogleExpand.bind(this, false)}
                                className="fa fa-compress"
                            />
                        )
                    }
                </div>

                {/* <AttributeBox attrs={this.state.selected_attributes} /> */}
                <div className="details-card-content">
                    <AttrHistory device={device} type={attr.value_type} attr={attr.label} />
                </div>
            </div>
        );
    }
}

Attribute.propTypes = {
    device: PropTypes.objectOf(PropTypes.shape({
        id: PropTypes.string,
    })).isRequired,
    attr: PropTypes.array.isRequired,
};

export default Attribute;
