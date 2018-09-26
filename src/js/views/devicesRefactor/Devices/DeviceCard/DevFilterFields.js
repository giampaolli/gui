/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import TemplateActions from '../../../../actions/TemplateActions';
import TemplateStore from '../../../../stores/TemplateStore';
import MaterialSelect from '../../../../components/MaterialSelect';

class DevFilterFields extends Component {
    constructor(props) {
        super(props);

        this.convertTemplateList = this.convertTemplateList.bind(this);
        this.createSelectTemplates = this.createSelectTemplates.bind(this);
        this.templates = [];
    }

    convertTemplateList() {
        this.templates = [];
        for (const k in TemplateStore.state.templates) {
            if (TemplateStore.state.templates.hasOwnProperty(k)) {
                this.templates.push(TemplateStore.state.templates[k]);
            }
        }
    }

    createSelectTemplates() {
        const items = [];
        items.push(<option key="select_template" value="">Select Template</option>);
        for (let i = 0; i < this.templates.length; i++) {
            items.push(<option key={this.templates[i].id} value={this.templates[i].id}>
                {this.templates[i].label}
                       </option>);
        }
        return items;
    }

    componentDidMount() {
        TemplateActions.fetchTemplates.defer();
    }

    render() {
        // console.log('DevFilterFields', this.props);
        if (this.templates.length == 0) this.convertTemplateList();

        this.opts = this.createSelectTemplates();
        return (
            <div className="col s12 m12">
                <div className="col s5 m5">
                    <div className="dev_field_filter">
                        <label htmlFor="fld_device_name">Device Name</label>
                        <input id="fld_device_name" type="text" className="form-control form-control-lg margin-top-mi7px" placeholder="Device Name" value={this.props.fields.label} name="label" onChange={this.props.onChange} />
                    </div>
                </div>
                <div className="col s1 m1">&nbsp;</div>

                <div className="col s6 m6">
                    <div className="col s12">
                        <MaterialSelect id="flr_templates" name="templates" label="Templates" value={this.props.fields.templates} onChange={this.props.onChange}>
                            {this.opts}
                        </MaterialSelect>
                    </div>
                </div>
            </div>
        );
    }
}

// DevFilterFields.propTypes = {
//     fields: PropTypes.objectOf(PropTypes.shape({
//         label: PropTypes.string,
//     })).isRequired,
//     onChange: PropTypes.func.isRequired,
// };

export default DevFilterFields;
