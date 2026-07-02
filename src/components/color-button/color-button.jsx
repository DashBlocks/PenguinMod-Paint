import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {MIXED} from '../../helper/style-path';

import noFillIcon from './no-fill.svg';
import mixedFillIcon from './mixed-fill.svg';
import styles from './color-button.css';
import GradientTypes from '../../lib/gradient-types';
import log from '../../log/log';

const stopsToBackground = (stops, gradientType) => {
    if (stops[0].color === MIXED) return 'white';
    if (stops[0].color === null && gradientType === GradientTypes.SOLID) return 'white';
    switch (gradientType) {
    case GradientTypes.SOLID: return stops[0].color;
    case GradientTypes.HORIZONTAL: return `linear-gradient(to right, ${stops.map((stop) => `${stop.color} ${stop.offset * 100}%`).join(',')})`;
    case GradientTypes.RADIAL: return `radial-gradient(${stops.map((stop) => `${stop.color} ${stop.offset * 100}%`).join(',')})`;
    default: log.error(`Unrecognized gradient type: ${gradientType}`);
    }
};

const ColorButtonComponent = props => (
    <div
        className={styles.colorButton}
        onClick={props.onClick}
    >
        <div
            className={classNames(styles.colorButtonSwatch, {
                [styles.outlineSwatch]: props.outline && !(props.color === MIXED)
            })}
            style={{
                background: stopsToBackground(props.stops, props.gradientType)
            }}
        >
            {props.stops[0].color === null && props.gradientType === GradientTypes.SOLID ? (
                <img
                    className={styles.swatchIcon}
                    draggable={false}
                    src={noFillIcon}
                />
            ) : props.stops[0].color === MIXED ? (
                <img
                    className={styles.swatchIcon}
                    draggable={false}
                    src={mixedFillIcon}
                />
            ) : null}
        </div>
        <div className={styles.colorButtonArrow}>▾</div>
    </div>
);

ColorButtonComponent.propTypes = {
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    onClick: PropTypes.func.isRequired,
    outline: PropTypes.bool.isRequired,
    stops: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        offset: PropTypes.number
    }))
};

ColorButtonComponent.defaultProps = {
    outline: false
};

export default ColorButtonComponent;
