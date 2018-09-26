/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import MeasureActions from '../../../../../../actions/MeasureActions';

class DynamicAttributeList extends Component {
    constructor(props) {
        super(props);
        this.state = { truncate: false };
        this.clickAttr = this.clickAttr.bind(this);
        this.limitSizeField = this.limitSizeField.bind(this);
    }

    componentWillMount() {
        const device = this.props.device;
        for (const i in device.attrs) {
            for (const j in device.attrs[i]) {
                if (device.attrs[i][j].type !== 'meta') {
                    if (device.attrs[i][j].type === 'dynamic') {
                        if (device.attrs[i][j].value_type === 'geo:point') {
                            MeasureActions.fetchPosition.defer(device, device.id, device.attrs[i][j].label);
                        }
                    }
                    MeasureActions.fetchMeasure.defer(device, device.attrs[i][j].label, 10);
                }
            }
        }

        this.limitSizeField(this.props.attrs);
    }

    clickAttr(attr) {
        this.props.change_attr(attr);
    }

    limitSizeField(dyAttrs) {
        dyAttrs.map((dyAttr) => {
            if (dyAttr.label.length > 20) {
                this.setState({ truncate: true });
            }
        });
    }

    render() {
        return (
            <div className=" dy_attributes">
                <div className="col s12 header">
                    <div className="col s2 filter-icon">
                        {/* <i className="fa fa-filter" /> */}
                    </div>
                    <label className="col s10">Dynamic attributes</label>
                    {/* <div className="col s2 search-icon">
            <i className="fa fa-search" />
          </div> */}
                </div>
                <div className="col s12 body">
                    {this.props.attrs.map(attr => (
                        <div key={attr.label} className="line" onClick={this.clickAttr.bind(this, attr)}>
                            <div className="col offset-s2 s8">
                                <div className={this.state.truncate ? 'label truncate' : 'label'} title={attr.label}>{attr.label}</div>
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

// DynamicAttributeList.propTypes = {
//     device: PropTypes.objectOf(PropTypes.shape({
//         id: PropTypes.string,
//     })).isRequired,
//     attrs: PropTypes.array.isRequired,
//     changeAttr: PropTypes.func.isRequired,
// };

export default DynamicAttributeList;
