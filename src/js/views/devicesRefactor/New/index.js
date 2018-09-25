import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    componentDidMount() {
        const { params } = this.props;
        FormActions.set(null);
        const edit = params.device;
        if (edit) {
            FormActions.fetch(edit);
        }
        TemplateActions.fetchTemplates.defer();
    }

    render() {
        const { params } = this.props;
        let edition = false;
        if (params.device) edition = true;

        let ops = (device) => {
            DeviceActions.addDevice(device, () => {
                toaster.success('Device created');
                hashHistory.push('/device/list');
            });
        };

        if (params.device) {
            ops = (device) => {
                DeviceActions.triggerUpdate(device, () => {
                    toaster.success('Device updated');
                    hashHistory.push('/device/list');
                });
            };
        }

        return (
            <div className="full-width full-height">
                <ReactCSSTransitionGroup transitionName="first" transitionAppear transitionAppearTimeout={500} transitionEntattrTypeerTimeout={500} transitionLeaveTimeout={500}>
                    <NewPageHeader title="Devices" subtitle="device manager" icon="device">
                        <div className="box-sh">
                            {params.device ? (
                                <DojotBtnRedCircle
                                    to={`/device/id/${params.device}/detail`}
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
                        <DeviceForm
                            deviceid={params.device}
                            edition={edition}
                            operator={ops}
                        />
                    </AltContainer>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

NewDevice.propTypes = {
    params: PropTypes.objectOf(PropTypes.shape({
        device: PropTypes.array,
    })).isRequired,
};

export default NewDevice;
