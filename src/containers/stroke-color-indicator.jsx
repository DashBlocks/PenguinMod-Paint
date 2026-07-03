import {connect} from 'react-redux';
import {defineMessages} from 'react-intl';

import {changeColorIndex} from '../reducers/color-index';
import {addOtherStrokeStop,
    changeStrokeColor,
    changeStrokeGradientType,
    moveStrokeStop,
    removeStrokeStop} from '../reducers/stroke-style';
import {changeStrokeWidth} from '../reducers/stroke-width';
import {openStrokeColor, closeStrokeColor} from '../reducers/modals';
import {getSelectedLeafItems} from '../helper/selection';
import {setSelectedItems} from '../reducers/selected-items';
import Modes, {GradientToolsModes} from '../lib/modes';
import {isBitmap} from '../lib/format';

import makeColorIndicator from './color-indicator.jsx';

const messages = defineMessages({
    label: {
        id: 'paint.paintEditor.stroke',
        description: 'Label for the color picker for the outline color',
        defaultMessage: 'Outline'
    }
});

const StrokeColorIndicator = makeColorIndicator(messages.label, true);

const mapStateToProps = state => ({
    colorIndex: state.scratchPaint.fillMode.colorIndex,
    disabled: state.scratchPaint.mode === Modes.BRUSH ||
        state.scratchPaint.mode === Modes.TEXT ||
        state.scratchPaint.mode === Modes.FILL,
    stops: state.scratchPaint.color.strokeColor.stops,
    fillBitmapShapes: state.scratchPaint.fillBitmapShapes,
    colorModalVisible: state.scratchPaint.modals.strokeColor,
    format: state.scratchPaint.format,
    gradientType: state.scratchPaint.color.strokeColor.gradientType,
    isEyeDropping: state.scratchPaint.color.eyeDropper.active,
    mode: state.scratchPaint.mode,
    shouldShowGradientTools: state.scratchPaint.mode in GradientToolsModes,
    textEditTarget: state.scratchPaint.textEditTarget
});

const mapDispatchToProps = dispatch => ({
    onAddOtherStop: (stopColor, index) => {
        dispatch(addOtherStrokeStop(stopColor, index));
    },
    onChangeColorIndex: index => {
        dispatch(changeColorIndex(index));
    },
    onChangeColor: (strokeColor, index) => {
        dispatch(changeStrokeColor(strokeColor, index));
    },
    onChangeStrokeWidth: strokeWidth => {
        dispatch(changeStrokeWidth(strokeWidth));
    },
    onOpenColor: () => {
        dispatch(openStrokeColor());
    },
    onCloseColor: () => {
        dispatch(closeStrokeColor());
    },
    onChangeGradientType: gradientType => {
        dispatch(changeStrokeGradientType(gradientType));
    },
    onMoveStop: (offset, index) => {
        dispatch(moveStrokeStop(offset, index));
    },
    onRemoveStop: (index) => {
        dispatch(removeStrokeStop(index));
    },
    setSelectedItems: format => {
        dispatch(setSelectedItems(getSelectedLeafItems(), isBitmap(format)));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StrokeColorIndicator);
