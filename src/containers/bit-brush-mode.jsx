import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import {MIXED} from '../helper/style-path';

import {changeFillColor, clearFillGradient, DEFAULT_COLOR} from '../reducers/fill-style';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
import {clearSelection} from '../helper/selection';

import BitBrushModeComponent from '../components/bit-brush-mode/bit-brush-mode.jsx';
import BitBrushTool from '../helper/bit-tools/brush-tool';

class BitBrushMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isBitBrushModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (this.tool && nextProps.stops !== this.props.stops) {
            this.tool.setColor(nextProps.stops[0].color);
        }
        if (this.tool && nextProps.bitBrushSize !== this.props.bitBrushSize) {
            this.tool.setBrushSize(nextProps.bitBrushSize);
        }

        if (nextProps.isBitBrushModeActive && !this.props.isBitBrushModeActive) {
            this.activateTool();
        } else if (!nextProps.isBitBrushModeActive && this.props.isBitBrushModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isBitBrushModeActive !== this.props.isBitBrushModeActive;
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        this.props.clearGradient();
        // Force the default brush color if fill is MIXED or transparent
        let color = this.props.stops[0].color;
        if (!color || color === MIXED) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
            color = DEFAULT_COLOR;
        }
        this.tool = new BitBrushTool(
            this.props.onUpdateImage
        );
        this.tool.setColor(color);
        this.tool.setBrushSize(this.props.bitBrushSize);

        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <BitBrushModeComponent
                isSelected={this.props.isBitBrushModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

BitBrushMode.propTypes = {
    bitBrushSize: PropTypes.number.isRequired,
    clearGradient: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isBitBrushModeActive: PropTypes.bool.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    stops: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        offset: PropTypes.number
    }))
};

const mapStateToProps = state => ({
    bitBrushSize: state.scratchPaint.bitBrushSize,
    color: state.scratchPaint.color.fillColor.primary,
    isBitBrushModeActive: state.scratchPaint.mode === Modes.BIT_BRUSH,
    stops: state.scratchPaint.color.fillColor.stops
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    clearGradient: () => {
        dispatch(clearFillGradient());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BIT_BRUSH));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor, 0));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BitBrushMode);
