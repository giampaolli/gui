/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import DeviceStore from '../../../../stores/DeviceStore';
import DeviceFormStore from '../../../../stores/DeviceHandlerStore';
import util from '../../../../comms/util/util';
import { DojotBtnClassic } from '../../../../components/DojotButton';
import toaster from '../../../../comms/util/materialize';
import FormActions, { AttrActions } from '../../../../actions/DeviceHandlerActions';
import DeviceHeader from './DeviceHeader';
import StaticAttributes from './StaticAttributes';
import AttrBox from './AttrBox';
import AttrActuatorBox from './AttrActuatorBox';
import TemplateFrame from './TemplateFrame';

class DeviceForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templateState: 0,
            staticAttrs: [],
            templates: [],
            selectedTemplates: [],
            loaded: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeAttr = this.handleChangeAttr.bind(this);

        this.toggleTemplate = this.toggleTemplate.bind(this);
        this.setTemplateState = this.setTemplateState.bind(this);
        this.save = this.save.bind(this);

        this.getStaticAttributes = this.getStaticAttributes.bind(this);
        this.handleStaticsAttributes = this.handleStaticsAttributes.bind(this);
        this.removeStaticAttributes = this.removeStaticAttributes.bind(this);
    }

    componentDidMount() {
        if (!this.props.edition) this.setState({ templateState: 1 });
    }

    componentDidUpdate() {
        const templates = this.props.templates.templates;
        const device = this.props.device.device;
        if (
            !this.state.loaded
      && templates != undefined
      && templates.length > 0
      && Object.keys(this.props.device.usedTemplates).length
      && this.state.selectedTemplates.length == 0
        ) {
            const list = [];
            let currentAttrs = this.state.staticAttrs;

            for (const tmp_id in this.props.device.usedTemplates) {
                for (const k in templates) {
                    if (templates[k].id == this.props.device.usedTemplates[tmp_id]) {
                        templates[k].active = true;
                        list.push(JSON.parse(JSON.stringify(templates[k])));
                        currentAttrs = currentAttrs.concat(this.handleStaticsAttributes(templates[k], device));
                        break;
                    }
                }
            }
            this.setState({ selectedTemplates: list, loaded: true, staticAttrs: currentAttrs });
        }
    }

    handleStaticsAttributes(template, device) {
        function getAttributesFromDevice(deviceAttrs) {
            let configAttrs = [];
            for (const tmp in deviceAttrs) {
                for (const index in deviceAttrs[tmp]) {
                    if (deviceAttrs[tmp][index].type == 'static' || deviceAttrs[tmp][index].type == 'meta') {
                        configAttrs = configAttrs.concat(deviceAttrs[tmp][index]);
                    }
                }
            }
            return configAttrs;
        }
        let listAttrs = [];
        listAttrs = listAttrs.concat(getAttributesFromDevice(device.attrs)); // Handle config attributes from device

        if (this.props.edition) {
            const list = listAttrs.map((attr) => {
                attr.value = attr.static_value;
                return attr;
            });
            return list;
        }
        return this.getStaticAttributes(template);
    }

    save(e) {
        e.preventDefault();

        const to_be_checked = DeviceFormStore.getState().device;
        const ret = util.isNameValid(to_be_checked.label);
        if (!ret.result) {
            toaster.error(ret.error);
            return;
        }

        // templates describe all attributes that should be applied to device, so we only need set values related to static attributes.
        AttrActions.update(this.state.staticAttrs);


        // set templates used
        const template_list = [];
        for (const k in this.state.selectedTemplates) {
            template_list.push(this.state.selectedTemplates[k].id);
        }
        FormActions.update({ f: 'templates', v: template_list });

        // console.log('Object to be saved: ', JSON.parse(JSON.stringify(DeviceFormStore.getState().device)));

        // Now, saves the device;
        const ongoingOps = DeviceStore.getState().loading;
        if (ongoingOps == false) {
            //console.log('ongoingOps');
            this.props.operator(JSON.parse(JSON.stringify(DeviceFormStore.getState().device)), this.props.deviceid);
            hashHistory.push('/device/list');
        }
    }

    componentWillUnmount() {
        FormActions.set(null);
    }

    setTemplateState(state) {
        this.setState({ templateState: state });
    }

    toggleTemplate(tmpt) {
    // check if the template have already been added
        const selectedTemplate = this.state.selectedTemplates.filter(item => item.id === tmpt.id);
        let currentAttrs = this.state.staticAttrs;
        let list = [];
        if (selectedTemplate.length == 0) // adding new template
        {
            list = this.state.selectedTemplates;
            list.push(tmpt);
            currentAttrs = currentAttrs.concat(this.getStaticAttributes(tmpt));
        } else { // removing template
            list = this.state.selectedTemplates.filter(item => item.id !== tmpt.id);
            currentAttrs = this.removeStaticAttributes(tmpt, currentAttrs);
        }

        this.setState({
            selectedTemplates: list,
            staticAttrs: currentAttrs,
        });
    }

    handleChange(event) {
        event.preventDefault();
        const f = event.target.name;
        const v = event.target.value;
        FormActions.update({ f, v });
    }

    handleChangeAttr(label, val) {
        const st = this.state.staticAttrs;
        for (const k in st) {
            if (st[k].label == label) st[k].value = val;
        }
        this.setState({ staticAttrs: st });
    }

    removeStaticAttributes(template, current_list) {
        const list = current_list
            .filter(i => String(i.template_id) != template.id);
        return list;
    }

    getStaticAttributes(template) {
        const list = template.attrs
            .filter(i => (String(i.type) == 'static') || (String(i.type) == 'meta'))
            .map((attr) => {
                // check if there is a current static value in device store
                if (attr.id) {
                    if (this.props.device.attrNames[attr.id]) attr.value = this.props.device.attrNames[attr.id];
                    else attr.value = attr.static_value;
                } else {
                    attr.id = util.sid();
                    attr.value = attr.static_value;
                }
                attr.template_id = template.id;
                return attr;
            });
        return list;
    }

    render() {
    // preparing template list to be used
        const templates = this.props.templates.templates;
        for (const k in templates) {
            templates[k].active = false;
            for (const j in this.state.selectedTemplates) {
                if (templates[k].id == this.state.selectedTemplates[j].id) {
                    templates[k].active = true;
                }
            }
        }
        // console.log("this.state.selectedTemplates",this.state.selectedTemplates)
        return (
            <div className={`row device device-frame mb0 ${this.props.className ? this.props.className : ''}`}>
                <div className="col s7 data-frame">
                    <div className="col s12">
                        {this.state.selectedTemplates.length > 0 ? (
                            <div className="react-bug-escape">
                                <div className="col s12 p0">
                                    <div className="col s9 p0">
                                        <DeviceHeader name={this.props.device.device.label} onChange={this.handleChange} />
                                    </div>
                                    <div className="col s3 p0 mt30px text-right">
                                        <DojotBtnClassic is_secondary={false} onClick={this.save} label="Save" title="Save" />
                                        <div className="col s12 p0 mt10px ">
                                            <DojotBtnClassic is_secondary to={this.props.edition ? `/device/id/${this.props.deviceid}/detail` : '/device/list'} label="Discard" title="Discard" />
                                        </div>

                                    </div>
                                </div>
                                <StaticAttributes attrs={this.state.staticAttrs} onChange={this.handleChangeAttr} />
                                <div className="attr-box">
                                    <div className="col s12">
                                        <div className="attr-title">Dynamic attributes</div>
                                    </div>
                                    {this.state.selectedTemplates.map(tplt => (
                                        <AttrBox key={tplt.id} {...tplt} />
                                    ))}
                                </div>
                                <div className="attr-box">
                                    <div className="col s12">
                                        <div className="attr-title">Actuators</div>
                                    </div>
                                    {this.state.selectedTemplates.map(tplt => (
                                        <AttrActuatorBox key={tplt.id} {...tplt} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="padding10 background-info pb160px">
                Select a template to start
                            </div>
                        )}
                    </div>
                </div>

                <div className="col s5 p0">
                    {this.state.templateState == 0 ? (
                        <TemplateFrame
                            changeState={this.setTemplateState}
                            toggleTemplate={this.toggleTemplate}
                            templates={this.state.selectedTemplates}
                            state={this.state.templateState}
                            numberOfTemplates={this.props.templates.templates.length}
                        />
                    ) : (
                        <TemplateFrame
                            changeState={this.setTemplateState}
                            toggleTemplate={this.toggleTemplate}
                            templates={templates}
                            state={this.state.templateState}
                            numberOfTemplates={this.props.templates.templates.length}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default DeviceForm;
