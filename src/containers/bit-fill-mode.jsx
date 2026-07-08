import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import GradientTypes from '../lib/gradient-types';

import FillModeComponent from '../components/bit-fill-mode/bit-fill-mode.jsx';

import {addOtherFillStop, changeFillColor, DEFAULT_COLOR} from '../reducers/fill-style';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
import {changeGradientType} from '../reducers/fill-mode-gradient-type';
import {clearSelection} from '../helper/selection';
import FillTool from '../helper/bit-tools/fill-tool';
import {generateSecondaryColor, MIXED} from '../helper/style-path';

class BitFillMode extends React.Component {
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

        // Force the default brush color if fill is MIXED or transparent
        let stops = this.props.stops;
        if (this.props.stops[0].color === MIXED) {
            stops = [{
                color: DEFAULT_COLOR,
                offset: 0
            }];
            this.props.onChangeFillColor(DEFAULT_COLOR, 0);
        }
        const gradientType = this.props.fillModeGradientType ?
            this.props.fillModeGradientType : this.props.styleGradientType;
        if (gradientType !== this.props.styleGradientType) {
            if (this.props.styleGradientType === GradientTypes.SOLID) {
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
        this.tool = new FillTool(this.props.onUpdateImage);
        this.tool.setStops(stops);
        this.tool.setGradientType(gradientType);
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

BitFillMode.propTypes = {
    changeGradientType: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    styleGradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    fillModeGradientType: PropTypes.oneOf(Object.keys(GradientTypes)),
    handleMouseDown: PropTypes.func.isRequired,
    isFillModeActive: PropTypes.bool.isRequired,
    onAddOtherStop: PropTypes.func.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    stops: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        offset: PropTypes.number
    }))
};

const mapStateToProps = state => ({
    fillModeGradientType: state.scratchPaint.fillMode.gradientType, // Last user-selected gradient type
    styleGradientType: state.scratchPaint.color.fillColor.gradientType,
    isFillModeActive: state.scratchPaint.mode === Modes.BIT_FILL,
    stops: state.scratchPaint.color.fillColor.stops
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    changeGradientType: gradientType => {
        dispatch(changeGradientType(gradientType));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BIT_FILL));
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
)(BitFillMode);
