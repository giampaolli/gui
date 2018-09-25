/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement"] */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint class-methods-use-this: 0 */
/* eslint jsx-a11y/label-has-associated-control: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GenericList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openStaticMap: true,
            visibleStaticMap: false,
            truncate: false,
        };

        this.openMap = this.openMap.bind(this);
        this.verifyIsGeo = this.verifyIsGeo.bind(this);
        this.limitSizeField = this.limitSizeField.bind(this);
    }

    componentWillMount() {
        const { attrs } = this.props;
        this.limitSizeField(attrs);
    }

    openMap() {
        const { device, openStaticMap: openStaticMapProps } = this.props;
        const { openStaticMap, visibleStaticMap } = this.state;
        for (const k in device.attrs) {
            for (const j in device.attrs[k]) {
                if (device.attrs[k][j].value_type === 'geo:point') {
                    if (device.attrs[k][j].static_value !== '') {
                        this.setState({
                            openStaticMap: !openStaticMap,
                            visibleStaticMap: !visibleStaticMap,
                        });
                        openStaticMapProps(openStaticMap);
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
        attrs.forEach((attr) => {
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
        const {
            attrs,
            img,
            boxTitle,
            device,
        } = this.props;
        const { truncate, visibleStaticMap } = this.state;
        this.verifyIsGeo(attrs);
        return (
            <div className="row stt-attributes">
                <div className="col s12 header">
                    <div className="icon">
                        <img src={img} alt="img" />
                    </div>
                    <label>{boxTitle}</label>
                </div>
                <div className="col s12 body">
                    {boxTitle === 'Configurations' ? (
                        <div key="id" className="line display-flex">
                            <div className="col s12 pr0">
                                <div className="col s5">
                                    <div className="name-value">device id</div>
                                    <div className="value-label">Name</div>
                                </div>
                                <div className="col s7 p0 text-right">
                                    <div className="value-value pr0">{device.id}</div>
                                    <div className="value-label pr0">STRING</div>
                                </div>
                            </div>
                        </div>
                    ) : ('')}
                    {attrs.map(attr => (
                        attr.isGeo ? (
                            <div
                                role="button"
                                tabIndex="0"
                                key={attr.label}
                                className="line col s12 pl30"
                                id="static-geo-attribute"
                                onClick={this.openMap}
                                onKeyPress={this.openMap}
                            >
                                <div className="display-flex-column flex-1">
                                    <div
                                        className={truncate
                                            ? 'name-value display-flex flex-1 space-between truncate'
                                            : 'name-value display-flex flex-1 space-between'
                                        }
                                        title={attr.label}
                                    >
                                        {attr.label}
                                        <div className="star">
                                            <i className={`fa ${visibleStaticMap ? 'fa-star' : 'fa-star-o'}`} />
                                        </div>
                                    </div>
                                    <div className="display-flex-no-wrap space-between">
                                        <div className={truncate ? 'value-value truncate' : 'value-value'} title={attr.static_value}>
                                            {attr.static_value.length > 25
                                                ? `${attr.static_value.substr(1, 22)}...`
                                                : attr.static_value
                                            }
                                        </div>
                                        <div className="value-label" title={attr.value_type}>{attr.value_type}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div key={attr.label} className="line col s12 pl30">
                                <div className="display-flex-column flex-1">
                                    <div className={truncate ? 'name-value  truncate' : 'name-value '} title={attr.label}>{attr.label}</div>
                                    <div className="display-flex-no-wrap space-between">
                                        <div className={truncate ? 'value-value  truncate' : 'value-value '} title={attr.static_value}>
                                            {attr.static_value.length > 25
                                                ? `${attr.static_value.substr(1, 22)}...`
                                                : attr.static_value
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

GenericList.defaultProps = {
    attrs: [],
    openStaticMap: () => null,
};

GenericList.propTypes = {
    attrs: PropTypes.arrayOf,
    img: PropTypes.string.isRequired,
    boxTitle: PropTypes.string.isRequired,
    device: PropTypes.objectOf(PropTypes.shape({
        id: PropTypes.string,
    })).isRequired,
    openStaticMap: PropTypes.func,
};

export default GenericList;
