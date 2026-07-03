import makeColorStyleReducer from '../lib/make-color-style-reducer';
import GradientTypes from '../lib/gradient-types';

const ADD_OTHER_STROKE_STOP = 'scratch-paint/stroke-style/ADD_OTHER_STROKE_STOP';
const CHANGE_STROKE_COLOR = 'scratch-paint/stroke-style/CHANGE_STROKE_COLOR';
const CHANGE_STROKE_GRADIENT_TYPE = 'scratch-paint/stroke-style/CHANGE_STROKE_GRADIENT_TYPE';
const CLEAR_STROKE_GRADIENT = 'scratch-paint/stroke-style/CLEAR_STROKE_GRADIENT';
const DEFAULT_COLOR = '#000000';
const MOVE_STROKE_STOP = 'scratch-paint/stroke-style/MOVE_STROKE_STOP';
const REMOVE_STROKE_STOP = 'scratch-paint/stroke-style/REMOVE_STROKE_STOP';

import {CHANGE_STROKE_WIDTH} from './stroke-width';

const reducer = makeColorStyleReducer({
    addOtherStopAction: ADD_OTHER_STROKE_STOP,
    changeColorAction: CHANGE_STROKE_COLOR,
    changeGradientTypeAction: CHANGE_STROKE_GRADIENT_TYPE,
    clearGradientAction: CLEAR_STROKE_GRADIENT,
    defaultColor: DEFAULT_COLOR,
    moveStopAction: MOVE_STROKE_STOP,
    removeStopAction: REMOVE_STROKE_STOP,
    selectionColorKey: 'strokeColor',
    selectionGradientTypeKey: 'strokeGradientType'
});

// This is mostly the same as the generated reducer, but with one piece of extra logic to set the transparent color when the
// stroke width is set to 0.
// https://redux.js.org/recipes/structuring-reducers/reusing-reducer-logic
const strokeReducer = function (state, action) {
    if (action.type === CHANGE_STROKE_WIDTH && Math.max(action.strokeWidth, 0) === 0) {
        return {
            ...state,
            stops: [{
                color: 'rgba(0,0,0,0)',
                offset: 0
            }],
            gradientType: GradientTypes.SOLID
        };
    }

    return reducer(state, action);
};

// Action creators ==================================
const addOtherStrokeStop = function (stopColor, index) {
    return {
        type: ADD_OTHER_STROKE_STOP,
        color: stopColor,
        index
    };
};

const changeStrokeColor = function (strokeColor, index) {
    return {
        type: CHANGE_STROKE_COLOR,
        color: strokeColor,
        index
    };
};

const changeStrokeGradientType = function (gradientType) {
    return {
        type: CHANGE_STROKE_GRADIENT_TYPE,
        gradientType
    };
};

const clearStrokeGradient = function () {
    return {
        type: CLEAR_STROKE_GRADIENT
    };
};

const moveStrokeStop = function (offset, index) {
    return {
        type: MOVE_STROKE_STOP,
        offset,
        index
    };
};

const removeStrokeStop = function (index) {
    return {
        type: REMOVE_STROKE_STOP,
        index
    };
};

export {
    strokeReducer as default,
    addOtherStrokeStop,
    changeStrokeColor,
    changeStrokeGradientType,
    clearStrokeGradient,
    moveStrokeStop,
    removeStrokeStop,
    DEFAULT_COLOR,
    CHANGE_STROKE_GRADIENT_TYPE
};
