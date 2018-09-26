/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import MeasureStore from '../../../../../../stores/MeasureStore';
import { Attr } from '../../../../../../components/HistoryElements';
import ConfigStore from '../../../../../../stores/ConfigStore';

class AttrHistory extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="graphLarge">
                <AltContainer stores={{MeasureStore: MeasureStore, Config: ConfigStore}}>
                    <Attr device={this.props.device} type={this.props.type} attr={this.props.attr} label={this.props.attr} isStatic={false} />
                </AltContainer>
            </div>
        );
    }
}

// AttrHistory.propTypes = {
//     device: PropTypes.objectOf(PropTypes.shape({
//         id: PropTypes.string,
//     })).isRequired,
//     type: PropTypes.string.isRequired,
//     attr: PropTypes.array,
// };

export default AttrHistory;
