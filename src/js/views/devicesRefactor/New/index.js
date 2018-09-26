/* eslint-disable */ 
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { hashHistory } from 'react-router';
import AltContainer from 'alt-container';
import { NewPageHeader } from '../../../containers/full/PageHeader';
import DeviceActions from '../../../actions/DeviceActions';
import { DojotBtnRedCircle } from '../../../components/DojotButton';
import TemplateStore from '../../../stores/TemplateStore';
import TemplateActions from '../../../actions/TemplateActions';
import toaster from '../../../comms/util/materialize';
import DeviceFormStore from '../../../stores/DeviceHandlerStore';
import FormActions from '../../../actions/DeviceHandlerActions';
import DeviceForm from './DeviceForm';


class NewDevice extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        FormActions.set(null);
        const edit = this.props.params.device;
        if (edit) {
            FormActions.fetch(edit);
        }
        TemplateActions.fetchTemplates.defer();
    }

    render() {
        let title = 'New device';
        let edition = false;
        if (this.props.params.device) edition = true;

        let ops = function (device) {
            DeviceActions.addDevice(device, (device) => {
                toaster.success('Device created');
                hashHistory.push('/device/list');
            });
        };
        if (this.props.params.device) {
            title = 'Edit device';
            ops = function (device) {
                DeviceActions.triggerUpdate(device, () => {
                    toaster.success('Device updated');
                    hashHistory.push('/device/list');
                });
            };
        }
        // console.log('this.props,', this.props);
        return (
            <div className="full-width full-height">
                <ReactCSSTransitionGroup transitionName="first" transitionAppear transitionAppearTimeout={500} transitionEntattrTypeerTimeout={500} transitionLeaveTimeout={500}>
                    <NewPageHeader title="Devices" subtitle="device manager" icon="device">
                        <div className="box-sh">
                            {this.props.params.device ? (
                                <DojotBtnRedCircle
                                    to={`/device/id/${this.props.params.device}/detail`}
                                    icon="fa fa-arrow-left"
                                    tooltip="Return to device details"
                                />
                            ) : (
                                <DojotBtnRedCircle
                                    to="/device/list"
                                    icon="fa fa-arrow-left"
                                    tooltip="Return to device list"
                                />
                            )}
                        </div>
                    </NewPageHeader>
                    <AltContainer stores={{ device: DeviceFormStore, templates: TemplateStore }}>
                        <DeviceForm deviceid={this.props.params.device} edition={edition} operator={ops} />
                    </AltContainer>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}
// NewDevice.propTypes = {
//     params: PropTypes.objectOf(PropTypes.shape({
//         device: PropTypes.array,
//     })).isRequired,
// };

export default NewDevice;
