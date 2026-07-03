import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import GradientTypes from '../lib/gradient-types';
import FillTool from '../helper/tools/fill-tool';
import {generateSecondaryColor, MIXED} from '../helper/style-path';

import {addOtherFillStop, changeFillColor, DEFAULT_COLOR} from '../reducers/fill-style';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
import {clearSelection} from '../helper/selection';
import {clearHoveredItem, setHoveredItem} from '../reducers/hover';
import {changeGradientType} from '../reducers/fill-mode-gradient-type';

import FillModeComponent from '../components/fill-mode/fill-mode.jsx';

class FillMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isFillModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (this.tool) {
            if (nextProps.stops !== this.props.stops) {
                this.tool.setStops(nextProps.stops);
            }
            if (nextProps.hoveredItemId !== this.props.hoveredItemId) {
                this.tool.setPrevHoveredItemId(nextProps.hoveredItemId);
            }
            if (nextProps.fillModeGradientType !== this.props.fillModeGradientType) {
                this.tool.setGradientType(nextProps.fillModeGradientType);
            }
        }

        if (nextProps.isFillModeActive && !this.props.isFillModeActive) {
            this.activateTool();
        } else if (!nextProps.isFillModeActive && this.props.isFillModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isFillModeActive !== this.props.isFillModeActive;
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);

        // Force the default fill color if fill is MIXED
        let stops = this.props.stops;
        if (this.props.stops[0].color === MIXED) {
            stops = [{
                color: DEFAULT_COLOR,
                offset: 0
            }];
            this.props.onChangeFillColor(DEFAULT_COLOR, 0);
        }
        const gradientType = this.props.fillModeGradientType ?
            this.props.fillModeGradientType : this.props.fillStyleGradientType;
        if (gradientType !== this.props.fillStyleGradientType) {
            if (this.props.fillStyleGradientType === GradientTypes.SOLID) {
                const generatedColor = generateSecondaryColor(fillColor);
                stops = stops.append({
                    color: generatedColor,
                    offset: 1
                });
                this.props.onAddOtherStop(generatedColor, 0);
            }
            if (gradientType === GradientTypes.SOLID) {
                stops = [stops[0]];
            }
            this.props.changeGradientType(gradientType);
        }
        this.tool = new FillTool(
            this.props.setHoveredItem,
            this.props.clearHoveredItem,
            this.props.onUpdateImage
        );
        this.tool.setStops(stops);
        this.tool.setGradientType(gradientType);
        this.tool.setPrevHoveredItemId(this.props.hoveredItemId);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <FillModeComponent
                isSelected={this.props.isFillModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

FillMode.propTypes = {
    changeGradientType: PropTypes.func.isRequired,
    clearHoveredItem: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    fillStyleGradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    fillModeGradientType: PropTypes.oneOf(Object.keys(GradientTypes)),
    handleMouseDown: PropTypes.func.isRequired,
    hoveredItemId: PropTypes.number,
    isFillModeActive: PropTypes.bool.isRequired,
    onAddOtherStop: PropTypes.func.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    setHoveredItem: PropTypes.func.isRequired,
    stops: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        offset: PropTypes.number
    }))
};

const mapStateToProps = state => ({
    fillModeGradientType: state.scratchPaint.fillMode.gradientType, // Last user-selected gradient type
    fillStyleGradientType: state.scratchPaint.color.fillColor.gradientType, // Selected item(s)' gradient type
    hoveredItemId: state.scratchPaint.hoveredItemId,
    isFillModeActive: state.scratchPaint.mode === Modes.FILL,
    stops: state.scratchPaint.color.fillColor.stops,
});
const mapDispatchToProps = dispatch => ({
    setHoveredItem: hoveredItemId => {
        dispatch(setHoveredItem(hoveredItemId));
    },
    clearHoveredItem: () => {
        dispatch(clearHoveredItem());
    },
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    changeGradientType: gradientType => {
        dispatch(changeGradientType(gradientType));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.FILL));
    },
    onAddOtherStop: (stopColor, index) => {
        dispatch(addOtherFillStop(stopColor, index));
    },
    onChangeFillColor: (fillColor, index) => {
        dispatch(changeFillColor(fillColor, index));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FillMode);
