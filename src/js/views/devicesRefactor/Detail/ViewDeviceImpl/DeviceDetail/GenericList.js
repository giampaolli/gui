/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class GenericList extends Component {
    constructor(props) {
        super(props);
        this.state = { openStaticMap: true, visible_static_map: false, truncate: false };

        this.openMap = this.openMap.bind(this);
        this.verifyIsGeo = this.verifyIsGeo.bind(this);
        this.limitSizeField = this.limitSizeField.bind(this);
    }

    componentWillMount() {
        this.limitSizeField(this.props.attrs);
    }

    openMap(visible) {
        const device = this.props.device;
        for (const k in device.attrs) {
            for (const j in device.attrs[k]) {
                if (device.attrs[k][j].value_type === 'geo:point') {
                    if (device.attrs[k][j].static_value !== '') {
                        this.setState({
                            openStaticMap: !this.state.openStaticMap,
                            visible_static_map: !this.state.visible_static_map,
                        });
                        this.props.openStaticMap(this.state.openStaticMap);
                    }
                }
            }
        }
    }

    verifyIsGeo(attrs) {
        for (const k in attrs) {
            if (attrs[k].value_type === 'geo:point' || attrs[k].value_type === 'geo') {
                attrs[k].isGeo = true;
            } else {
                attrs[k].isGeo = false;
            }
        }
    }

    limitSizeField(attrs) {
        attrs.map((attr) => {
            if (attr.static_value !== undefined) {
                if (attr.type === 'meta') {
                    // values of configurations
                    if (attr.static_value.length > 20) {
                        this.setState({ truncate: true });
                    }
                } else {
                    if (attr.label.length > 20 || attr.value_type > 20) {
                        this.setState({ truncate: true });
                    }
                    // Values of static attributes
                    if (attr.static_value.length > 20) {
                        this.setState({ truncate: true });
                    }
                }
            }
        });
    }

    render() {
        this.verifyIsGeo(this.props.attrs);
        return (
            <div className="row stt-attributes">
                <div className="col s12 header">
                    <div className="icon">
                        <img src={this.props.img} />
                    </div>
                    <label>{this.props.box_title}</label>
                </div>
                <div className="col s12 body">
                    {this.props.box_title == 'Configurations' ? (
                        <div key="id" className="line display-flex">
                            <div className="col s12 pr0">
                                <div className="col s5">
                                    <div className="name-value">device id</div>
                                    <div className="value-label">Name</div>
                                </div>
                                <div className="col s7 p0 text-right">
                                    <div className="value-value pr0">{this.props.device.id}</div>
                                    <div className="value-label pr0">STRING</div>
                                </div>
                            </div>
                        </div>
                    ) : ('')}
                    {this.props.attrs.map(attr => (
                        attr.isGeo ? (
                            <div key={attr.label} className="line col s12 pl30" id="static-geo-attribute" onClick={this.openMap}>
                                <div className="display-flex-column flex-1">
                                    <div className={this.state.truncate ? 
                                        'name-value display-flex flex-1 space-between truncate' : 
                                        'name-value display-flex flex-1 space-between'} 
                                        title={attr.label}
                                    >
                                        {attr.label}
                                        <div className="star">
                                            <i className={`fa ${this.state.visible_static_map ? 'fa-star' : 'fa-star-o'}`} />
                                        </div>
                                    </div>
                                    <div className="display-flex-no-wrap space-between">
                                        <div className={this.state.truncate ? 'value-value truncate' : 'value-value'} title={attr.static_value}>
                                            {attr.static_value.length > 25 ?
                                                attr.static_value.substr(1, 22) + '...' :
                                                attr.static_value
                                            }
                                        </div>
                                        <div className="value-label" title={attr.value_type}>{attr.value_type}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div key={attr.label} className="line col s12 pl30">
                                <div className="display-flex-column flex-1">
                                    <div className={this.state.truncate ? 'name-value  truncate' : 'name-value '} title={attr.label}>{attr.label}</div>
                                    <div className="display-flex-no-wrap space-between">
                                        <div className={this.state.truncate ? 'value-value  truncate' : 'value-value '} title={attr.static_value}>
                                            {attr.static_value.length > 25 ?
                                                attr.static_value.substr(1, 22) + '...' :
                                                attr.static_value
                                            }
                                        </div>
                                        <div className="value-label" title={attr.value_type}>{attr.value_type}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        );
    }
}

// GenericList.defaultProps = {
//     attrs: [],
//     openStaticMap: () => null,
// };

// GenericList.propTypes = {
//     attrs: PropTypes.arrayOf,
//     img: PropTypes.string.isRequired,
//     boxTitle: PropTypes.string.isRequired,
//     device: PropTypes.objectOf(PropTypes.shape({
//         id: PropTypes.string,
//     })).isRequired,
//     openStaticMap: PropTypes.func,
// };

export default GenericList;
