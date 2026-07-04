import paper from '@turbowarp/paper';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import {MIXED} from '../helper/style-path';
import ColorStyleProptype from '../lib/color-style-proptype';
import GradientTypes from '../lib/gradient-types';

import {changeFillColor, clearFillGradient, DEFAULT_COLOR} from '../reducers/fill-style';
import {changeStrokeColor, clearStrokeGradient} from '../reducers/stroke-style';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {setCursor} from '../reducers/cursor';

import {clearSelection, getSelectedLeafItems} from '../helper/selection';
import OvalTool from '../helper/tools/oval-tool';
import OvalModeComponent from '../components/oval-mode/oval-mode.jsx';

class OvalMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool',
            'validateColorState'
        ]);
    }
    componentDidMount () {
        if (this.props.isOvalModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (this.tool && nextProps.colorState !== this.props.colorState) {
            this.tool.setColorState(nextProps.colorState);
        }
        if (this.tool && nextProps.selectedItems !== this.props.selectedItems) {
            this.tool.onSelectionChanged(nextProps.selectedItems);
        }

        if (nextProps.isOvalModeActive && !this.props.isOvalModeActive) {
            this.activateTool();
        } else if (!nextProps.isOvalModeActive && this.props.isOvalModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isOvalModeActive !== this.props.isOvalModeActive;
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        this.validateColorState();

        this.tool = new OvalTool(
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
            this.props.onUpdateImage
        );
        this.tool.setColorState(this.props.colorState);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    validateColorState () {
        // Make sure that at least one of fill/stroke is set, and that MIXED is not one of the colors.
        // If fill and stroke color are both missing, set fill to default and stroke to transparent.
        // If exactly one of fill or stroke color is set, set the other one to transparent.
        const {strokeWidth} = this.props.colorState;
        const fillColor1 = this.props.colorState.fillColor.stops[0].color;
        let fillGradient = this.props.colorState.fillColor.gradientType;
        const strokeColor1 = this.props.colorState.strokeColor.stops[0].color;
        let strokeGradient = this.props.colorState.strokeColor.gradientType;

        const fillColorMissing = fillColor1 === MIXED;
        const strokeColorMissing = strokeColor1 === MIXED ||
            strokeWidth === null ||
            strokeWidth === 0;

        if (fillColorMissing && strokeColorMissing) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
            this.props.onChangeStrokeColor('#00000000');
        } else if (fillColorMissing && !strokeColorMissing) {
            this.props.onChangeFillColor('#00000000');
        } else if (!fillColorMissing && strokeColorMissing) {
            this.props.onChangeStrokeColor('#00000000');
        }
    }
    render () {
        return (
            <OvalModeComponent
                isSelected={this.props.isOvalModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

OvalMode.propTypes = {
    clearFillGradient: PropTypes.func.isRequired,
    clearStrokeGradient: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    colorState: PropTypes.shape({
        fillColor: ColorStyleProptype,
        strokeColor: ColorStyleProptype,
        strokeWidth: PropTypes.number
    }).isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isOvalModeActive: PropTypes.bool.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onChangeStrokeColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.instanceOf(paper.Item)),
    setCursor: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    colorState: state.scratchPaint.color,
    isOvalModeActive: state.scratchPaint.mode === Modes.OVAL,
    selectedItems: state.scratchPaint.selectedItems
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    clearFillGradient: () => {
        dispatch(clearFillGradient());
    },
    clearStrokeGradient: () => {
        dispatch(clearStrokeGradient());
    },
    setCursor: cursorString => {
        dispatch(setCursor(cursorString));
    },
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems(), false /* bitmapMode */));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.OVAL));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor, 0));
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor, 0));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OvalMode);
