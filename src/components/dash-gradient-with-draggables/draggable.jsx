import React from 'react';
import parseColor from 'parse-color';
import PropTypes from 'prop-types';

import noFillIcon from '../color-button/no-fill.svg';
import styles from './draggable.css';

const colorIsTransparent = colorString => {
    if (colorString === null) return true;
    if (colorString.startsWith('#') && colorString.length === 9) {
        // parseColor does not properly parse alpha of hex colors
        return parseInt(colorString.substr(colorString.length - 2), 16) === 0;
    } else {
        return parseColor(colorString).hsva[3] === 0;
    }
};

const Draggable = props => (
    <div
        className={styles.draggable}
        onPointerDown={props.onMoveDraggablePointerDown}
        style={{
            "--draggable-offset": props.stop.offset
        }}
    >
        <div className={styles.draggableTip} />
        <div
            className={styles.draggableButton}
            onClick={props.onSelectColor}
        >
            {colorIsTransparent(props.stop.color) ? (
                <div
                    className={styles.draggableButtonSwatch}
                    style={{backgroundColor: 'white'}}
                >
                    <img
                        className={styles.swatchIcon}
                        draggable={false}
                        src={noFillIcon}
                    />
                </div>
            ) : (
                <div
                    className={styles.draggableButtonSwatch}
                    style={{backgroundColor: props.stop.color}}
                />
            )}
        </div>
    </div>
);

Draggable.propTypes = {
    onMoveDraggablePointerDown: PropTypes.func.isRequired,
    onSelectColor: PropTypes.func.isRequired,
    stop: PropTypes.shape({
        color: PropTypes.string,
        offset: PropTypes.number
    })
};

export default Draggable;
