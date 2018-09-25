/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: ["error", "WithStatement"] */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import util from '../../../../comms/util/util';

const SummaryItem = ({ device }) => {
    let attrs = 0;

    for (const attribute in device.attrs) {
        attrs += device.attrs[attribute].length;
    }

    return (

        <Link to={`/device/id/${device.id}/detail`}>
            <div className="card-size card-hover lst-entry-wrapper z-depth-2 fullHeight">
                <div className="lst-entry-title col s12">
                    <img className="title-icon" src="images/icons/chip-wt.png" alt="chip" />
                    <div className="title-text truncate">
                        <span className="text" title={device.label}>
                            {' '}
                            {device.label}
                            {' '}
                        </span>
                    </div>
                </div>
                <div className="attr-list">
                    <div className="attr-area light-background">
                        <div className="attr-row">
                            <div className="icon">
                                <img src="images/tag.png" alt="tag" />
                            </div>
                            <div className="attr-content">
                                <input type="text" value={attrs} disabled />
                                <span>Properties</span>
                            </div>
                            <div className="center-text-parent material-btn right-side" />
                        </div>
                        <div className="attr-row">
                            <div className="icon">
                                <img src="images/update.png" alt="update" />
                            </div>
                            <div className="attr-content">
                                <input type="text" value={util.iso_to_date(device.created)} disabled />
                                <span>Last update</span>
                            </div>
                            <div className="center-text-parent material-btn right-side" />
                        </div>
                        <div className={device.status} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

SummaryItem.propTypes = {
    device: PropTypes.shape({
        id: PropTypes.string,
        attrs: PropTypes.object,
        label: PropTypes.string,
        created: PropTypes.string,
    }).isRequired,
};

export default SummaryItem;
