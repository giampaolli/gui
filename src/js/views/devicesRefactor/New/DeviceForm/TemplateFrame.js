/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { DojotBtnCircle } from '../../../../components/DojotButton';


class TemplateFrame extends Component {
    constructor(props) {
        super(props);
        // this.handleRemove = this.handleRemove.bind(this);
        this.toggleTemplate = this.toggleTemplate.bind(this);
        this.removeTemplate = this.removeTemplate.bind(this);
        this.setAditionMode = this.setAditionMode.bind(this);
        this.setRemovalMode = this.setRemovalMode.bind(this);
        this.showSearchBox = this.showSearchBox.bind(this);
    }

    removeTemplate(template) {
        this.props.toggleTemplate(template);
    }

    toggleTemplate(template) {
        this.props.toggleTemplate(template);
    }

    setAditionMode() {
        this.props.changeState(1);
    }

    setRemovalMode() {
        this.props.changeState(0);
    }

    showSearchBox() {
        // console.log('Not implemented yet');
    }

    render() {
        if (this.props.numberOfTemplates > 0) {
            return (
                <div className="col s12 template-frame">
                    <div className="col s12 header">
                        { this.props.state == 0 ? (
                            <label className="col s6 text-left">Selected Templates </label>
                        ) : (
                            <label className="col s6 text-left">All Templates </label>
                        )}

                        <div className="col s6 text-right">
                            { this.props.state == 0 ? (
                                <DojotBtnCircle click={this.setAditionMode} icon="fa fa-plus" tooltip="Add templates" />
                            ) : (
                                <div>
                                    <DojotBtnCircle click={this.setRemovalMode} icon="fa fa-chevron-left" tooltip="Remove templates" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col s12 body">
                        {this.props.templates.map(temp => (
                            <div key={temp.id} className="card template-card" title={temp.label}>
                                { this.props.state == 0 ? (
                                    <div>
                                        <div onClick={this.removeTemplate.bind(this, temp)} className="remove-layer">
                                            <i className="fa fa-remove" />
                                        </div>
                                        <div className="template-name truncate space-p-r">{temp.label}</div>
                                    </div>
                                ) : (
                                    null
                                )}

                                { this.props.state == 1 ? (
                                    <div>
                                        { temp.active ? (
                                            <div onClick={this.toggleTemplate.bind(this, temp)} className="active-layer">
                                                <i className="fa fa-check" />
                                            </div>) : (
                                                <div onClick={this.toggleTemplate.bind(this, temp)} className="empty-layer" />
                                        ) }
                                        <div className="template-name truncate">{temp.label}</div>
                                    </div>
                                ) : (
                                    null
                                )}
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

// TemplateFrame.defaultProps = {
//     numberOfTemplates: 0,
//     state: -1,
//     templates: {},
// };

// TemplateFrame.propTypes = {
//     changeState: PropTypes.func.isRequired,
//     toggleTemplate: PropTypes.func.isRequired,
//     numberOfTemplates: PropTypes.number,
//     state: PropTypes.number,
//     templates: PropTypes.objectOf(PropTypes.shape({
//         label: PropTypes.string,
//     })),
// };

export default TemplateFrame;
