/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement"] */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint react/no-did-update-set-state: 0 */
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
            selectedTemplates: [],
            loaded: false,
        };

        this.name = '';
        this.value = '';

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeAttr = this.handleChangeAttr.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleTemplate = this.toggleTemplate.bind(this);
        this.setTemplateState = this.setTemplateState.bind(this);
        this.save = this.save.bind(this);

        this.getStaticAttributes = this.getStaticAttributes.bind(this);
        this.handleStaticsAttributes = this.handleStaticsAttributes.bind(this);
        this.removeStaticAttributes = this.removeStaticAttributes.bind(this);
    }

    componentDidMount() {
        const { edition } = this.props;
        if (!edition) this.setState({ templateState: 1 });
    }

    componentDidUpdate() {
        const { loaded, selectedTemplates, staticAttrs } = this.state;
        const { templates: propsTemplate, device: propsDevice } = this.props;
        const { templates } = propsTemplate;
        const { device } = propsDevice;

        if (!loaded && templates !== undefined && templates.length > 0
            && Object.keys(propsDevice.usedTemplates).length && selectedTemplates.length === 0) {
            const list = [];
            let currentAttrs = staticAttrs;
            for (const tmpId in propsDevice.usedTemplates) {
                for (const k in templates) {
                    if (templates[k].id === propsDevice.usedTemplates[tmpId]) {
                        templates[k].active = true;
                        list.push(JSON.parse(JSON.stringify(templates[k])));
                        currentAttrs = currentAttrs.concat(
                            this.handleStaticsAttributes(templates[k], device),
                        );
                        break;
                    }
                }
            }
            this.setState({ selectedTemplates: list, loaded: true, staticAttrs: currentAttrs });
        }
    }

    componentWillUnmount() {
        FormActions.set(null);
    }

    getStaticAttributes(template) {
        const { device } = this.props;
        const list = template.attrs
            .filter(i => (String(i.type) === 'static') || (String(i.type) === 'meta'))
            .map((attr) => {
                // check if there is a current static value in device store
                if (attr.id) {
                    if (device.attrNames[attr.id]) attr.value = device.attrNames[attr.id];
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

    setTemplateState(state) {
        this.setState({ templateState: state });
    }

    handleStaticsAttributes(template, device) {
        const { edition } = this.props;
        function getAttributesFromDevice(deviceAttrs) {
            let configAttrs = [];
            for (const tmp in deviceAttrs) {
                for (const index in deviceAttrs[tmp]) {
                    if (deviceAttrs[tmp][index].type === 'static' || deviceAttrs[tmp][index].type === 'meta') {
                        configAttrs = configAttrs.concat(deviceAttrs[tmp][index]);
                    }
                }
            }
            return configAttrs;
        }
        let listAttrs = [];
        // Handle config attributes from device
        listAttrs = listAttrs.concat(getAttributesFromDevice(device.attrs));

        if (edition) {
            const list = listAttrs.map((attr) => {
                attr.value = attr.static_value;
                return attr;
            });
            return list;
        }
        return this.getStaticAttributes(template);
    }

    save(e) {
        const { staticAttrs, selectedTemplates } = this.state;
        const { operator, deviceid } = this.props;
        e.preventDefault();

        const toBeChecked = DeviceFormStore.getState().device;
        const ret = util.isNameValid(toBeChecked.label);
        if (!ret.result) {
            toaster.error(ret.error);
            return;
        }

        // templates describe all attributes that should be applied to device,
        // so we only need set values related to static attributes.
        AttrActions.update(staticAttrs);


        // set templates used
        const templateList = [];
        for (const k in selectedTemplates) {
            templateList.push(selectedTemplates[k].id);
        }
        FormActions.update({ f: 'templates', v: templateList });

        // console.log('Object to be saved: ',
        // JSON.parse(JSON.stringify(DeviceFormStore.getState().device)));
        // Now, saves the device;
        const ongoingOps = DeviceStore.getState().loading;
        if (ongoingOps === false) {
            // console.log('ongoingOps');
            operator(JSON.parse(JSON.stringify(DeviceFormStore.getState().device)), deviceid);
        }
    }

    toggleTemplate(tmpt) {
        const { staticAttrs, selectedTemplates } = this.state;
        // check if the template have already been added
        const selectedTemplate = selectedTemplates.filter(item => item.id === tmpt.id);
        let currentAttrs = staticAttrs;
        let list = [];
        if (selectedTemplate.length === 0) { // adding new template
            list = selectedTemplates;
            list.push(tmpt);
            currentAttrs = currentAttrs.concat(this.getStaticAttributes(tmpt));
        } else { // removing template
            list = selectedTemplates.filter(item => item.id !== tmpt.id);
            currentAttrs = this.removeStaticAttributes(tmpt, currentAttrs);
        }

        this.setState({
            selectedTemplates: list,
            staticAttrs: currentAttrs,
        });
    }

    handleChange(event) {
        event.preventDefault();
        this.name = event.target.name;
        this.value = event.target.value;
        FormActions.update({ f: this.name, v: this.value });
    }

    handleChangeAttr(label, val) {
        const { staticAttrs } = this.state;
        for (const k in staticAttrs) {
            if (staticAttrs[k].label === label) staticAttrs[k].value = val;
        }
        this.setState({ staticAttrs });
    }

    removeStaticAttributes(template, currentList) {
        this.template = template;
        return currentList
            .filter(i => String(i.template_id) !== template.id);
    }

    render() {
        // preparing template list to be used
        const { selectedTemplates, staticAttrs, templateState } = this.state;
        const {
            templates: propsTemplate,
            device: propsDevice,
            className = '',
            edition,
            deviceid,
        } = this.props;
        const { templates } = propsTemplate;
        const { device } = propsDevice;

        for (const k in templates) {
            templates[k].active = false;
            for (const j in selectedTemplates) {
                if (templates[k].id === selectedTemplates[j].id) {
                    templates[k].active = true;
                }
            }
        }
        return (
            <div className={`row device device-frame mb0 ${className}`}>
                <div className="col s7 data-frame">
                    <div className="col s12">
                        {selectedTemplates.length > 0 ? (
                            <div className="react-bug-escape">
                                <div className="col s12 p0">
                                    <div className="col s9 p0">
                                        <DeviceHeader
                                            name={device.label}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col s3 p0 mt30px text-right">
                                        <DojotBtnClassic is_secondary={false} onClick={this.save} label="Save" title="Save" />
                                        <div className="col s12 p0 mt10px ">
                                            <DojotBtnClassic is_secondary to={edition ? `/device/id/${deviceid}/detail` : '/device/list'} label="Discard" title="Discard" />
                                        </div>

                                    </div>
                                </div>
                                <StaticAttributes
                                    attrs={staticAttrs}
                                    onChange={this.handleChangeAttr}
                                />
                                <div className="attr-box">
                                    <div className="col s12">
                                        <div className="attr-title">Dynamic attributes</div>
                                    </div>
                                    {selectedTemplates.map(tplt => (
                                        <AttrBox key={tplt.id} {...tplt} />
                                    ))}
                                </div>
                                <div className="attr-box">
                                    <div className="col s12">
                                        <div className="attr-title">Actuators</div>
                                    </div>
                                    {selectedTemplates.map(tplt => (
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
                    {templateState === 0 ? (
                        <TemplateFrame
                            changeState={this.setTemplateState}
                            toggleTemplate={this.toggleTemplate}
                            templates={selectedTemplates}
                            state={templateState}
                            numberOfTemplates={templates.length}
                        />
                    ) : (
                        <TemplateFrame
                            changeState={this.setTemplateState}
                            toggleTemplate={this.toggleTemplate}
                            templates={templates}
                            state={templateState}
                            numberOfTemplates={templates.length}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default DeviceForm;
