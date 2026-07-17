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
    if (hexString.startsWith('#') && hexString.length === 9) {
        // parseColor does not properly parse alpha of hex colors
        return parseInt(colorString.substr(colorString.length - 2), 16) === 0;
    } else {
        return parseColor(colorString).hsva[3] === 0;
    }
};

const stopsToGradient = (stops, gradientType) => {
    switch (gradientType) {
    case GradientTypes.HORIZONTAL:
        return (
            <linearGradient id="color-button-swatch-gradient">
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
            <radialGradient id="color-button-swatch-gradient">
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

const ColorButtonComponent = props => (
    <div
        className={styles.colorButton}
        onClick={props.onClick}
    >
        {props.gradientType === GradientTypes.SOLID && colorIsTransparent(props.stops[0].color) ? (
            <div
                className={classNames(styles.colorButtonSwatch, {
                    [styles.outlineSwatch]: props.outline
                })}
                style={{background: 'white'}}
            >
                <img
                    className={styles.swatchIcon}
                    draggable={false}
                    src={noFillIcon}
                />
            </div>
        ) : props.stops[0].color === MIXED ? (
            <div
                className={styles.colorButtonSwatch}
                style={{background: 'white'}}
            >
                <img
                    className={styles.swatchIcon}
                    draggable={false}
                    src={mixedFillIcon}
                />
            </div>
        ) : (
            <svg
                className={classNames(styles.colorButtonSwatch, {
                    [styles.outlineSwatch]: props.outline
                })}
                viewBox="0,0,32,32"
            >
                <defs>
                    {props.gradientType !== GradientTypes.SOLID && stopsToGradient(props.stops, props.gradientType)}
                </defs>
                <rect
                    width="32"
                    height="32"
                    fill={props.gradientType === GradientTypes.SOLID ? stops[0].color : "url(#color-button-swatch-gradient)"}
                />
            </svg>
        )}
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
