import React from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import MeasureStore from '../../../../../../stores/MeasureStore';
import { Attr } from '../../../../../../components/HistoryElements';
import ConfigStore from '../../../../../../stores/ConfigStore';

const AttrHistory = ({ device, type, attr }) => (
    <div className="graphLarge">
        <AltContainer stores={{ MeasureStore, Config: ConfigStore }}>
            <Attr
                device={device}
                type={type}
                attr={attr}
                label={attr}
                isStatic={false}
            />
        </AltContainer>
    </div>
);

AttrHistory.propTypes = {
    device: PropTypes.objectOf(PropTypes.shape({
        id: PropTypes.string,
    })).isRequired,
    type: PropTypes.string.isRequired,
    attr: PropTypes.array,
};

export default AttrHistory;
