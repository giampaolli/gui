/* eslint-disable */
import React from 'react';
// import PropTypes from 'prop-types';
import { DojotBtnLink } from '../../../components/DojotButton';

function OperationsHeader(props) {
    return (
        <div className="col s5 pull-right pt10">
            <div
                className="searchBtn"
                title="Show search bar"
                onClick={props.toggleSearchBar}
            >
                <i className="fa fa-search" />
            </div>
            {props.displayToggle}
            <DojotBtnLink
                linkto="/device/new"
                label="New Device"
                alt="Create a new device"
                icon="fa fa-plus"
                className="w130px"
            />
        </div>
    );
}

export default OperationsHeader;
