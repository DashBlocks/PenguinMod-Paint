import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';

import classNames from 'classnames';
import parseColor from 'parse-color';

import GradientWithDraggables from '../../containers/dash-gradient-with-draggables.jsx';
import Slider, {CONTAINER_WIDTH, HANDLE_WIDTH} from '../forms/slider.jsx';
import LabeledIconButton from '../labeled-icon-button/labeled-icon-button.jsx';
import styles from './color-picker.css';
import GradientTypes from '../../lib/gradient-types';
import {MIXED} from '../../helper/style-path';

import eyeDropperIcon from './icons/eye-dropper.svg';
import noFillIcon from '../color-button/no-fill.svg';
import mixedFillIcon from '../color-button/mixed-fill.svg';
import fillLinearIcon from '!../../tw-recolor/build!./icons/fill-horz-gradient-enabled.svg';
import fillRadialIcon from '!../../tw-recolor/build!./icons/fill-radial-enabled.svg';
import fillSolidIcon from '!../../tw-recolor/build!./icons/fill-solid-enabled.svg';
import addIcon from '!../../tw-recolor/build!./icons/add.svg';
import deleteIcon from '!../../tw-recolor/build!./icons/delete.svg';
import swapIcon from '!../../tw-recolor/build!./icons/swap.svg';
import Modes from '../../lib/modes';
import alphaBackground from './alpha.png';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import Input from '../forms/input.jsx';
import {makeAlphaComponent} from '../../lib/tw-color-utils';
import TWColorReadout from '../tw-color-readout/tw-color-readout.jsx';
import TWRenderRecoloredImage from '../../tw-recolor/render.jsx';

const BufferedInput = BufferedInputHOC(Input);

const hsvToHex = (h, s, v) =>
    // Scale hue back up to [0, 360] from [0, 100]
    parseColor(`hsv(${3.6 * h}, ${s}, ${v})`).hex
;

const messages = defineMessages({
    add: {
        defaultMessage: 'Add',
        description: 'Label for button that adds gradient stop',
        id: 'dash.paint.colorPicker.add'
    },
    delete: {
        defaultMessage: 'Delete',
        description: 'Label for the delete button',
        id: 'paint.modeTools.delete'
    },
    swap: {
        defaultMessage: 'Swap',
        description: 'Label for button that swaps the colors in a gradient',
        id: 'paint.colorPicker.swap'
    }
});
class ColorPickerComponent extends React.Component {
    _makeBackground (channel) {
        const stops = [];
        // Generate the color slider background CSS gradients by adding
        // color stops depending on the slider.
        for (let n = 100; n >= 0; n -= 10) {
            switch (channel) {
            case 'hue':
                stops.push(hsvToHex(n, this.props.saturation, this.props.brightness));
                break;
            case 'saturation':
                stops.push(hsvToHex(this.props.hue, n, this.props.brightness));
                break;
            case 'brightness':
                stops.push(hsvToHex(this.props.hue, this.props.saturation, n));
                break;
            case 'alpha': {
                const alpha = makeAlphaComponent(n / 100);
                stops.push(`${hsvToHex(this.props.hue, this.props.saturation, this.props.brightness)}${alpha}`);
                break;
            }
            default:
                throw new Error(`Unknown channel for color sliders: ${channel}`);
            }
        }

        // The sliders are a rounded capsule shape, and the slider handles are circles. As a consequence, when the
        // slider handle is fully to one side, its center is actually moved away from the start/end of the slider by
        // the slider handle's radius, meaning that the effective range of the slider excludes the rounded caps.
        // To compensate for this, position the first stop to where the rounded cap ends, and position the last stop
        // to where the rounded cap begins.
        const halfHandleWidth = HANDLE_WIDTH / 2;
        stops[0] += ` 0 ${halfHandleWidth}px`;
        stops[stops.length - 1] += ` ${CONTAINER_WIDTH - halfHandleWidth}px 100%`;

        let css = `linear-gradient(to left, ${stops.join(',')})`;
        if (channel === 'alpha') {
            css = `${css}, url("${alphaBackground}")`;
        }
        return css;
    }
    render () {
        return (
            <div
                className={styles.colorPickerContainer}
                dir={this.props.rtl ? 'rtl' : 'ltr'}
            >
                {this.props.shouldShowGradientTools && (
                    <div>
                        <div className={styles.row}>
                            <div className={styles.gradientPickerRow}>
                                <TWRenderRecoloredImage
                                    className={classNames({
                                        [styles.inactiveGradient]: this.props.gradientType !== GradientTypes.SOLID,
                                        [styles.clickable]: true
                                    })}
                                    draggable={false}
                                    src={fillSolidIcon}
                                    onClick={this.props.onChangeGradientTypeSolid}
                                    width={20}
                                    height={20}
                                />
                                <TWRenderRecoloredImage
                                    className={classNames({
                                        [styles.inactiveGradient]:
                                            this.props.gradientType !== GradientTypes.HORIZONTAL,
                                        [styles.clickable]: true
                                    })}
                                    draggable={false}
                                    src={fillLinearIcon}
                                    onClick={this.props.onChangeGradientTypeLinear}
                                    width={20}
                                    height={20}
                                />
                                <TWRenderRecoloredImage
                                    className={classNames({
                                        [styles.inactiveGradient]: this.props.gradientType !== GradientTypes.RADIAL,
                                        [styles.clickable]: true
                                    })}
                                    draggable={false}
                                    src={fillRadialIcon}
                                    onClick={this.props.onChangeGradientTypeRadial}
                                    width={20}
                                    height={20}
                                />
                            </div>
                        </div>
                        <div className={styles.divider} />
                        {this.props.gradientType !== GradientTypes.SOLID && (
                            <>
                                <div className={styles.row}>
                                    <div className={styles.gradientPickerRow}>
                                        <LabeledIconButton
                                            imgSrc={addIcon}
                                            title={this.props.intl.formatMessage(messages.add)}
                                            onClick={this.props.onAddOtherStop}
                                        />
                                        <LabeledIconButton
                                            imgSrc={deleteIcon}
                                            title={this.props.intl.formatMessage(messages.delete)}
                                            onClick={this.props.onRemoveStop}
                                        />
                                        <LabeledIconButton
                                            imgSrc={swapIcon}
                                            title={this.props.intl.formatMessage(messages.swap)}
                                            onClick={this.props.onSwap}
                                        />
                                    </div>
                                </div>
                                <div className={styles.divider} />
                                <div className={styles.row}>
                                    <div className={styles.gradientPickerRow}>
                                        <GradientWithDraggables
                                            colorIndex={this.props.colorIndex}
                                            gradientType={this.props.gradientType}
                                            onMoveStop={this.props.onMoveStop}
                                            onSelectColor={this.props.onSelectColor}
                                            stops={this.props.stops}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
                <div className={styles.row}>
                    <div className={styles.rowHeader}>
                        <span className={styles.labelName}>
                            <FormattedMessage
                                defaultMessage="Color"
                                description="Label for the hue component in the color picker"
                                id="paint.paintEditor.hue"
                            />
                        </span>
                        <TWColorReadout
                            value={this.props.hue}
                            onChange={this.props.onHueChange}
                        />
                    </div>
                    <div className={styles.rowSlider}>
                        <Slider
                            background={this._makeBackground('hue')}
                            value={this.props.hue}
                            onChange={this.props.onHueChange}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.rowHeader}>
                        <span className={styles.labelName}>
                            <FormattedMessage
                                defaultMessage="Saturation"
                                description="Label for the saturation component in the color picker"
                                id="paint.paintEditor.saturation"
                            />
                        </span>
                        <TWColorReadout
                            value={this.props.saturation}
                            onChange={this.props.onSaturationChange}
                        />
                    </div>
                    <div className={styles.rowSlider}>
                        <Slider
                            background={this._makeBackground('saturation')}
                            value={this.props.saturation}
                            onChange={this.props.onSaturationChange}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.rowHeader}>
                        <span className={styles.labelName}>
                            <FormattedMessage
                                defaultMessage="Brightness"
                                description="Label for the brightness component in the color picker"
                                id="paint.paintEditor.brightness"
                            />
                        </span>
                        <TWColorReadout
                            value={this.props.brightness}
                            onChange={this.props.onBrightnessChange}
                        />
                    </div>
                    <div className={styles.rowSlider}>
                        <Slider
                            background={this._makeBackground('brightness')}
                            value={this.props.brightness}
                            onChange={this.props.onBrightnessChange}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.rowHeader}>
                        <span className={styles.labelName}>
                            <FormattedMessage
                                defaultMessage="Opacity"
                                description="Label for the transparency component in the color picker"
                                id="tw.paint.alpha"
                            />
                        </span>
                        <TWColorReadout
                            value={this.props.alpha}
                            onChange={this.props.onAlphaChange}
                        />
                    </div>
                    <div className={styles.rowSlider}>
                        <Slider
                            lastSlider
                            background={this._makeBackground('alpha')}
                            value={this.props.alpha}
                            onChange={this.props.onAlphaChange}
                        />
                    </div>
                </div>
                <div className={styles.pickerRow}>
                    <Input
                        type="color"
                        className={styles.pickerColor}
                        // HTML color input does not understand transparency
                        value={this.props.hexColor ? this.props.hexColor.substr(0, 7) : '#000000'}
                        onChange={this.props.onHexColorChange}
                    />
                    <BufferedInput
                        type="text"
                        className={styles.pickerText}
                        value={this.props.hexColor || '#00000000'}
                        onSubmit={this.props.onHexColorChange}
                        placeholder="#123abc"
                    />
                </div>
                <div className={styles.swatchRow}>
                    <div className={styles.swatches}>
                        {this.props.mode === Modes.BIT_LINE ||
                            this.props.mode === Modes.BIT_RECT ||
                            this.props.mode === Modes.BIT_OVAL ||
                            this.props.mode === Modes.BIT_TEXT ? null :
                            (<div
                                className={classNames({
                                    [styles.clickable]: true,
                                    [styles.swatch]: true,
                                    [styles.activeSwatch]:
                                        (this.props.colorIndex === 0 && this.props.stops[0].color === null) ||
                                        (this.props.colorIndex === 1 && this.props.stops[1].color === null)
                                })}
                                onClick={this.props.onTransparent}
                            >
                                <img
                                    className={styles.swatchIcon}
                                    draggable={false}
                                    src={noFillIcon}
                                />
                            </div>)
                        }
                    </div>
                    <div className={styles.swatches}>
                        <div
                            className={classNames({
                                [styles.clickable]: true,
                                [styles.swatch]: true,
                                [styles.activeSwatch]: this.props.isEyeDropping
                            })}
                            onClick={this.props.onActivateEyeDropper}
                        >
                            <img
                                className={classNames(styles.swatchIcon, styles.pickerIcon)}
                                draggable={false}
                                src={eyeDropperIcon}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ColorPickerComponent.propTypes = {
    alpha: PropTypes.number.isRequired,
    onAlphaChange: PropTypes.func.isRequired,
    hexColor: PropTypes.string,
    onHexColorChange: PropTypes.func,
    brightness: PropTypes.number.isRequired,
    colorIndex: PropTypes.number.isRequired,
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    hue: PropTypes.number.isRequired,
    intl: intlShape.isRequired,
    isEyeDropping: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(Object.keys(Modes)),
    onActivateEyeDropper: PropTypes.func.isRequired,
    onAddOtherStop: PropTypes.func,
    onBrightnessChange: PropTypes.func.isRequired,
    onChangeGradientTypeLinear: PropTypes.func.isRequired,
    onChangeGradientTypeRadial: PropTypes.func.isRequired,
    onChangeGradientTypeSolid: PropTypes.func.isRequired,
    onHueChange: PropTypes.func.isRequired,
    onMoveStop: PropTypes.func,
    onRemoveStop: PropTypes.func,
    onSaturationChange: PropTypes.func.isRequired,
    onSelectColor: PropTypes.func.isRequired,
    onSwap: PropTypes.func,
    onTransparent: PropTypes.func.isRequired,
    rtl: PropTypes.bool.isRequired,
    saturation: PropTypes.number.isRequired,
    shouldShowGradientTools: PropTypes.bool.isRequired,
    stops: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        offset: PropTypes.number
    }))
};

export default injectIntl(ColorPickerComponent);
