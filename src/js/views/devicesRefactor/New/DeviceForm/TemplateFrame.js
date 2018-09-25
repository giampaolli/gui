/* eslint jsx-a11y/label-has-associated-control: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DojotBtnCircle } from '../../../../components/DojotButton';


class TemplateFrame extends Component {
    constructor(props) {
        super(props);
        this.toggleTemplate = this.toggleTemplate.bind(this);
        this.removeTemplate = this.removeTemplate.bind(this);
        this.setAditionMode = this.setAditionMode.bind(this);
        this.setRemovalMode = this.setRemovalMode.bind(this);
    }

    setRemovalMode() {
        const { changeState } = this.props;
        changeState(0);
    }

    setAditionMode() {
        const { changeState } = this.props;
        changeState(1);
    }

    removeTemplate(template) {
        const { toggleTemplate } = this.props;
        toggleTemplate(template);
    }

    toggleTemplate(template) {
        const { toggleTemplate } = this.props;
        toggleTemplate(template);
    }

    renderTemplate(temp) {
        const { state } = this.props;
        if (state === 0) {
            return (
                <div>
                    <div
                        role="button"
                        tabIndex="0"
                        onClick={this.removeTemplate(temp)}
                        onKeyPress={this.removeTemplate(temp)}
                        className="remove-layer"
                    >
                        <i className="fa fa-remove" />
                    </div>
                    <div className="template-name truncate space-p-r">{temp.label}</div>
                </div>
            );
        }
        if (state === 1) {
            return (
                <div>
                    { temp.active ? (
                        <div
                            role="button"
                            tabIndex="0"
                            onKeyPress={this.toggleTemplate(temp)}
                            onClick={this.toggleTemplate(temp)}
                            className="active-layer"
                        >
                            <i className="fa fa-check" />
                        </div>)
                        : (
                            <div
                                role="button"
                                tabIndex="0"
                                onKeyPress={this.toggleTemplate(temp)}
                                onClick={this.toggleTemplate(temp)}
                                className="empty-layer"
                            />
                        )
                    }
                    <div className="template-name truncate">{temp.label}</div>
                </div>
            );
        }
        return null;
    }

    render() {
        const { numberOfTemplates, state, templates } = this.props;
        if (numberOfTemplates > 0) {
            return (
                <div className="col s12 template-frame">
                    <div className="col s12 header">
                        { state === 0 ? (
                            <label className="col s6 text-left">Selected Templates </label>
                        ) : (
                            <label className="col s6 text-left">All Templates </label>
                        )}

                        <div className="col s6 text-right">
                            { state === 0 ? (
                                <DojotBtnCircle click={this.setAditionMode} icon="fa fa-plus" tooltip="Add templates" />
                            ) : (
                                <div>
                                    <DojotBtnCircle click={this.setRemovalMode} icon="fa fa-chevron-left" tooltip="Remove templates" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col s12 body">
                        {templates.map(temp => (
                            <div key={temp.id} className="card template-card" title={temp.label}>
                                { this.renderTemplate(temp)}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return (
            <div className="col s12 template-frame">
                <div className="padding10 background-info pb160px">Create a template first</div>
            </div>
        );
    }
}

TemplateFrame.defaultProps = {
    numberOfTemplates: 0,
    state: -1,
    templates: {},
};

TemplateFrame.propTypes = {
    changeState: PropTypes.func.isRequired,
    toggleTemplate: PropTypes.func.isRequired,
    numberOfTemplates: PropTypes.number,
    state: PropTypes.number,
    templates: PropTypes.objectOf(PropTypes.shape({
        label: PropTypes.string,
    })),
};

export default TemplateFrame;
