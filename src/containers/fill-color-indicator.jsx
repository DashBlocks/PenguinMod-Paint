import {connect} from 'react-redux';
import {defineMessages} from 'react-intl';

import {changeColorIndex} from '../reducers/color-index';
import {addOtherFillStop, changeFillColor, moveFillStop, removeFillStop} from '../reducers/fill-style';
import {changeGradientType} from '../reducers/fill-mode-gradient-type';
import {openFillColor, closeFillColor} from '../reducers/modals';
import {getSelectedLeafItems} from '../helper/selection';
import {setSelectedItems} from '../reducers/selected-items';
import Modes, {GradientToolsModes} from '../lib/modes';
import {isBitmap} from '../lib/format';

import makeColorIndicator from './color-indicator.jsx';

const messages = defineMessages({
    label: {
        id: 'paint.paintEditor.fill',
        description: 'Label for the color picker for the fill color',
        defaultMessage: 'Fill'
    }
});

const FillColorIndicator = makeColorIndicator(messages.label, false);

const mapStateToProps = state => ({
    colorIndex: state.scratchPaint.fillMode.colorIndex,
    disabled: state.scratchPaint.mode === Modes.PEN || state.scratchPaint.mode === Modes.LINE,
    stops: state.scratchPaint.color.fillColor.stops,
    colorModalVisible: state.scratchPaint.modals.fillColor,
    fillBitmapShapes: state.scratchPaint.fillBitmapShapes,
    format: state.scratchPaint.format,
    gradientType: state.scratchPaint.color.fillColor.gradientType,
    isEyeDropping: state.scratchPaint.color.eyeDropper.active,
    mode: state.scratchPaint.mode,
    shouldShowGradientTools: state.scratchPaint.mode in GradientToolsModes,
    textEditTarget: state.scratchPaint.textEditTarget
});

const mapDispatchToProps = dispatch => ({
    onAddOtherStop: (stopColor, index) => {
        dispatch(addOtherFillStop(stopColor, index));
    },
    onChangeColorIndex: index => {
        dispatch(changeColorIndex(index));
    },
    onChangeColor: (fillColor, index) => {
        dispatch(changeFillColor(fillColor, index));
    },
    onOpenColor: () => {
        dispatch(openFillColor());
    },
    onCloseColor: () => {
        dispatch(closeFillColor());
    },
    onChangeGradientType: gradientType => {
        dispatch(changeGradientType(gradientType));
    },
    onMoveStop: (offset, index) => {
        dispatch(moveFillStop(offset, index));
    },
    onRemoveStop: (index) => {
        dispatch(removeFillStop(index));
    },
    setSelectedItems: format => {
        dispatch(setSelectedItems(getSelectedLeafItems(), isBitmap(format)));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FillColorIndicator);
