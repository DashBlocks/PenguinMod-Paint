import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import parseColor from 'parse-color';
import {injectIntl, intlShape} from 'react-intl';

import {getSelectedLeafItems} from '../helper/selection';
import Formats, {isBitmap} from '../lib/format';
import GradientTypes from '../lib/gradient-types';

import ColorIndicatorComponent from '../components/color-indicator.jsx';
import {applyColorToSelection,
    applyGradientTypeToSelection,
    applyStrokeWidthToSelection,
    generateSecondaryColor,
    swapStopsInSelection,
    MIXED} from '../helper/style-path';

const makeColorIndicator = (label, isStroke) => {
    class ColorIndicator extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'handleChangeColor',
                'handleChangeGradientType',
                'handleCloseColor',
                'handleSwap'
            ]);

            // Flag to track whether an svg-update-worthy change has been made
            this._hasChanged = false;
        }
        componentWillReceiveProps (newProps) {
            const {colorModalVisible, onUpdateImage} = this.props;
            if (colorModalVisible && !newProps.colorModalVisible) {
                // Submit the new SVG, which also stores a single undo/redo action.
                if (this._hasChanged) onUpdateImage();
                this._hasChanged = false;
            }
        }
        handleChangeColor (newColor) {
            const formatIsBitmap = isBitmap(this.props.format);
            // Apply color and update redux, but do not update svg until picker closes.
            const isDifferent = applyColorToSelection(
                newColor,
                this.props.colorIndex,
                this.props.gradientType === GradientTypes.SOLID,
                // In bitmap mode, only the fill color selector is used, but it applies to stroke if fillBitmapShapes
                // is set to true via the "Fill"/"Outline" selector button
                isStroke || (formatIsBitmap && !this.props.fillBitmapShapes),
                this.props.textEditTarget);
            this._hasChanged = this._hasChanged || isDifferent;
            this.props.onChangeColor(newColor, this.props.colorIndex);
        }
        handleChangeGradientType (gradientType) {
            const formatIsBitmap = isBitmap(this.props.format);
            const generatedSecondaryColor = generateSecondaryColor(this.props.stops[0].color);
            // Apply color and update redux, but do not update svg until picker closes.
            const isDifferent = applyGradientTypeToSelection(
                gradientType,
                isStroke || (formatIsBitmap && !this.props.fillBitmapShapes),
                this.props.textEditTarget,
                generatedSecondaryColor);
            this._hasChanged = this._hasChanged || isDifferent;
            const hasSelectedItems = getSelectedLeafItems().length > 0;
            if (hasSelectedItems) {
                if (isDifferent) {
                    // Recalculates the swatch colors
                    this.props.setSelectedItems(this.props.format);
                }
            }
            if (this.props.gradientType === GradientTypes.SOLID && gradientType !== GradientTypes.SOLID) {
                // Generate color 2 and change to the 2nd swatch when switching from solid to gradient
                this.props.onAddOtherStop(generatedSecondaryColor, 0);
                this.props.onChangeColorIndex(1);
            }
            if (this.props.onChangeGradientType) this.props.onChangeGradientType(gradientType);
        }
        handleCloseColor () {
            // If the eyedropper is currently being used, don't
            // close the color menu.
            if (this.props.isEyeDropping) return;

            // Otherwise, close the color menu and
            // also reset the color index to indicate
            // that `color1` is selected.
            this.props.onCloseColor();
            this.props.onChangeColorIndex(0);
        }
        handleSwap () {
            if (getSelectedLeafItems().length) {
                const formatIsBitmap = isBitmap(this.props.format);
                const isDifferent = swapStopsInSelection(
                    isStroke || (formatIsBitmap && !this.props.fillBitmapShapes),
                    this.props.textEditTarget);
                this.props.setSelectedItems(this.props.format);
                this._hasChanged = this._hasChanged || isDifferent;
            } else {
                const newColors = this.props.stops.toReversed()
                    .map((stop) => stop.color === MIXED ? stop.color : parseColor(stop.color).hex);
                newColors.forEach((color, i) => this.props.onChangeColor(color, i));
            }
        }
        render () {
            return (
                <ColorIndicatorComponent
                    {...this.props}
                    label={this.props.intl.formatMessage(label)}
                    outline={isStroke}
                    onChangeColor={this.handleChangeColor}
                    onChangeGradientType={this.handleChangeGradientType}
                    onCloseColor={this.handleCloseColor}
                    onSwap={this.handleSwap}
                />
            );
        }
    }

    ColorIndicator.propTypes = {
        colorIndex: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
        colorModalVisible: PropTypes.bool.isRequired,
        fillBitmapShapes: PropTypes.bool.isRequired,
        format: PropTypes.oneOf(Object.keys(Formats)),
        gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
        intl: intlShape,
        isEyeDropping: PropTypes.bool.isRequired,
        onAddOtherStop: PropTypes.func.isRequired,
        onChangeColorIndex: PropTypes.func.isRequired,
        onChangeColor: PropTypes.func.isRequired,
        onChangeGradientType: PropTypes.func,
        onChangeStrokeWidth: PropTypes.func,
        onCloseColor: PropTypes.func.isRequired,
        onUpdateImage: PropTypes.func.isRequired,
        setSelectedItems: PropTypes.func.isRequired,
        stops: PropTypes.arrayOf(PropTypes.shape({
            color: PropTypes.string,
            offset: PropTypes.number
        })),
        textEditTarget: PropTypes.number
    };

    return injectIntl(ColorIndicator);
};

export default makeColorIndicator;
