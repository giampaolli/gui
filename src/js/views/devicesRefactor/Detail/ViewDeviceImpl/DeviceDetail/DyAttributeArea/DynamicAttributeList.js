/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement"] */
/* eslint jsx-a11y/label-has-associated-control: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MeasureActions from '../../../../../../actions/MeasureActions';

class DynamicAttributeList extends Component {
    constructor(props) {
        super(props);
        this.state = { truncate: false };
        this.clickAttr = this.clickAttr.bind(this);
        this.limitSizeField = this.limitSizeField.bind(this);
    }

    componentWillMount() {
        const { device, attrs } = this.props;
        for (const i in device.attrs) {
            for (const j in device.attrs[i]) {
                if (device.attrs[i][j].type !== 'meta') {
                    if (device.attrs[i][j].type === 'dynamic') {
                        if (device.attrs[i][j].value_type === 'geo:point') {
                            MeasureActions
                                .fetchPosition.defer(device, device.id, device.attrs[i][j].label);
                        }
                    }
                    MeasureActions.fetchMeasure.defer(device, device.attrs[i][j].label, 10);
                }
            }
        }

        this.limitSizeField(attrs);
    }

    clickAttr(attr) {
        const { changeAttr } = this.props;
        changeAttr(attr);
    }

    limitSizeField(dyAttrs) {
        dyAttrs.forEach((dyAttr) => {
            if (dyAttr.label.length > 20) {
                this.setState({ truncate: true });
            }
        });
    }

    render() {
        const { attrs } = this.props;
        const { truncate } = this.state;
        return (
            <div className=" dy_attributes">
                <div className="col s12 header">
                    <div className="col s2 filter-icon" />
                    <label className="col s10">Dynamic attributes</label>
                </div>
                <div className="col s12 body">
                    {attrs.map(attr => (
                        <div
                            role="button"
                            tabIndex="0"
                            key={attr.label}
                            className="line"
                            onClick={this.clickAttr.bind(this, attr)}
                            onKeyPress={this.clickAttr.bind(this, attr)}
                        >
                            <div className="col offset-s2 s8">
                                <div className={truncate ? 'label truncate' : 'label'} title={attr.label}>{attr.label}</div>
                                <div className="value-label">{attr.value_type}</div>
                            </div>
                            <div className="col s2">
                                <div className="star">
                                    <i className={`fa ${attr.visible ? 'fa-star' : 'fa-star-o'}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

DynamicAttributeList.propTypes = {
    device: PropTypes.objectOf(PropTypes.shape({
        id: PropTypes.string,
    })).isRequired,
    attrs: PropTypes.array.isRequired,
    changeAttr: PropTypes.func.isRequired,
};

export default DynamicAttributeList;
