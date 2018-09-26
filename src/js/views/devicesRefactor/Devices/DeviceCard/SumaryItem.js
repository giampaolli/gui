/* eslint-disable */
import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router';
import util from '../../../../comms/util/util';

function SummaryItem(props) {
    let attrs = 0;

    for (const attribute in props.device.attrs) {
        attrs += props.device.attrs[attribute].length;
    }
    // console.log('props.device.label: ', props.device.label);
    return (

        <Link to={`/device/id/${props.device.id}/detail`}>
            <div className="card-size card-hover lst-entry-wrapper z-depth-2 fullHeight">
                <div className="lst-entry-title col s12">
                    <img className="title-icon" src="images/icons/chip-wt.png" />
                    <div className="title-text truncate">
                        <span className="text" title={props.device.label}>
                            {' '}
                            {props.device.label}
                            {' '}
                        </span>
                    </div>
                </div>
                <div className="attr-list">
                    <div className="attr-area light-background">
                        <div className="attr-row">
                            <div className="icon">
                                <img src="images/tag.png" />
                            </div>
                            <div className="attr-content">
                                <input type="text" value={attrs} disabled />
                                <span>Properties</span>
                            </div>
                            <div className="center-text-parent material-btn right-side" />
                        </div>
                        <div className="attr-row">
                            <div className="icon">
                                <img src="images/update.png" />
                            </div>
                            <div className="attr-content">
                                <input type="text" value={util.iso_to_date(props.device.created)} disabled />
                                <span>Last update</span>
                            </div>
                            <div className="center-text-parent material-btn right-side" />
                        </div>
                        <div className={props.device.status} />
                    </div>
                </div>
            </div>
        </Link>
    );
}

// SummaryItem.propTypes = {
//     device: PropTypes.shape({
//         id: PropTypes.string,
//         attrs: PropTypes.object,
//         label: PropTypes.string,
//         created: PropTypes.string,
//     }).isRequired,
// };

export default SummaryItem;
