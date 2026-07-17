import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import GradientTypes from '../lib/gradient-types';

import GradientWithDraggablesComponent from '../components/dash-gradient-with-draggables/gradient-with-draggables.jsx';

const getEventXY = e => {
    if (e.touches && e.touches[0]) {
        return {x: e.touches[0].clientX, y: e.touches[0].clientY};
    } else if (e.changedTouches && e.changedTouches[0]) {
        return {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY};
    }
    return {x: e.clientX, y: e.clientY};
};

class GradientWithDraggables extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleMoveStopPointerDown',
            'setDraggablesBox'
        ]);
    }
    handleMoveStopPointerDown(e, stopIndex) {
        const onPointerMove = ev => {
            const newPosition = getEventXY(ev);
            const rect = this.draggablesBox.current.getBoundingClientRect();

            const minOffset = this.props.stops[stopIndex - 1]?.offset ?? 0;
            const maxOffset = this.props.stops[stopIndex + 1]?.offset ?? 1;

            const newOffset = Math.max(minOffset, Math.min(maxOffset, (newPosition.x - rect.x) / rect.width));
            this.props.onMoveStop(newOffset, stopIndex);
        };

        const onPointerUp = ev => {
            onPointerMove(ev); // Make sure stop offset is up-to-date
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    }
    setDraggablesBox (ref) {
        this.draggablesBox = ref;
    }
    render() {
        return (
            <GradientWithDraggablesComponent
                draggablesBoxRef={this.setDraggablesBox}
                gradientType={this.props.gradientType}
                onMoveStopPointerDown={this.handleMoveStopPointerDown}
                onSelectColor={this.props.onSelectColor}
                stops={this.props.stops}
            />
        );
    }
}

GradientWithDraggables.propTypes = {
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    onMoveStop: PropTypes.func,
    onSelectColor: PropTypes.func.isRequired,
    stops: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        offset: PropTypes.number
    }))
};

export default GradientWithDraggables;
