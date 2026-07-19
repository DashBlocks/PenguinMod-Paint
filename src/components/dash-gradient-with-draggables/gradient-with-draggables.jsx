import React from 'react';
import PropTypes from 'prop-types';
import Draggable from './draggable.jsx';
import GradientTypes from '../../lib/gradient-types';

import styles from './gradient-with-draggables.css';
import log from '../../log/log';

const stopsToGradient = (stops, gradientType) => {
    switch (gradientType) {
    case GradientTypes.HORIZONTAL:
        return (
            <linearGradient id="gradient-with-draggables-swatch-gradient">
                {stops.map((stop, index) => (
                    <stop
                        key={index}
                        offset={stop.offset}
                        stopColor={stop.color}
                    />
                ))}
            </linearGradient>
        );
    case GradientTypes.RADIAL:
        return (
            <radialGradient id="gradient-with-draggables-swatch-gradient">
                {stops.map((stop, index) => (
                    <stop
                        key={index}
                        offset={stop.offset}
                        stopColor={stop.color}
                    />
                ))}
            </radialGradient>
        );
    default:
        log.error(`Unrecognized gradient type: ${gradientType}`);
        return null;
    }
};

const GradientWithDraggablesComponent = props => (
    <div>
        <svg
            className={styles.gradientSwatch}
            viewBox="0,0,192,80"
        >
            <defs>
                {stopsToGradient(props.stops, props.gradientType)}
            </defs>
            <rect
                width="192"
                height="80"
                fill="url(#gradient-with-draggables-swatch-gradient)"
            />
        </svg>
        <div
            ref={props.draggablesBoxRef}
            className={styles.draggablesBox}
        >
            {props.stops.map((stop, index) => (
                <Draggable
                    active={index === props.colorIndex}
                    key={index}
                    onMoveStopPointerDown={e => props.onMoveStopPointerDown(e, index)}
                    onSelectColor={() => props.onSelectColor(index)}
                    stop={stop}
                />
            ))}
        </div>
    </div>
);

GradientWithDraggablesComponent.propTypes = {
    colorIndex: PropTypes.number.isRequired,
    draggablesBoxRef: PropTypes.func.isRequired,
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    onMoveStopPointerDown: PropTypes.func.isRequired,
    onSelectColor: PropTypes.func.isRequired,
    stops: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        offset: PropTypes.number
    }))
};

export default GradientWithDraggablesComponent;
