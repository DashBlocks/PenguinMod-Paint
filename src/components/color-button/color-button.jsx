import React from 'react';
import parseColor from 'parse-color';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {MIXED} from '../../helper/style-path';

import noFillIcon from './no-fill.svg';
import mixedFillIcon from './mixed-fill.svg';
import styles from './color-button.css';
import GradientTypes from '../../lib/gradient-types';
import log from '../../log/log';

const colorIsTransparent = colorString => {
    if (colorString === null) return true;
    if (colorString.startsWith('#') && colorString.length === 9) {
        // parseColor does not properly parse alpha of hex colors
        return parseInt(colorString.substr(colorString.length - 2), 16) === 0;
    } else {
        return parseColor(colorString).hsva[3] === 0;
    }
};

const stopsToGradient = (id, stops, gradientType) => {
    switch (gradientType) {
    case GradientTypes.HORIZONTAL:
        return (
            <linearGradient id={id}>
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
            <radialGradient id={id}>
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

const ColorButtonComponent = props => {
    const swatchGradientId = props.outline
        ? 'scratch-paint/color-button/swatch-stroke-gradient'
        : 'scratch-paint/color-button/swatch-fill-gradient';
    return (
        <div
            className={styles.colorButton}
            onClick={props.onClick}
        >
            <div
                className={classNames(styles.colorButtonSwatch, {
                    [styles.outlineSwatch]: props.outline && props.stops[0].color !== MIXED
                })}
            >
                {props.stops[0].color === MIXED ? (
                    <img
                        className={styles.swatchIcon}
                        draggable={false}
                        src={mixedFillIcon}
                    />
                ) : props.gradientType === GradientTypes.SOLID && colorIsTransparent(props.stops[0].color) ? (
                    <img
                        className={styles.swatchIcon}
                        draggable={false}
                        src={noFillIcon}
                    />
                ) : (
                    <svg viewBox="0,0,32,32">
                        <defs>
                            {props.gradientType !== GradientTypes.SOLID && stopsToGradient(swatchGradientId, props.stops, props.gradientType)}
                        </defs>
                        <rect
                            width="32"
                            height="32"
                            fill={props.gradientType === GradientTypes.SOLID ? props.stops[0].color : `url(#${swatchGradientId})`}
                        />
                    </svg>
                )}
            </div>
            <div className={styles.colorButtonArrow}>▾</div>
        </div>
    );
};

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
