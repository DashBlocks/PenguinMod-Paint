import makeColorStyleReducer from '../lib/make-color-style-reducer';

const ADD_OTHER_STROKE_STOP = 'scratch-paint/stroke-style/ADD_OTHER_STROKE_STOP';
const CHANGE_STROKE_COLOR = 'scratch-paint/stroke-style/CHANGE_STROKE_COLOR';
const CHANGE_STROKE_GRADIENT_TYPE = 'scratch-paint/stroke-style/CHANGE_STROKE_GRADIENT_TYPE';
const CLEAR_STROKE_GRADIENT = 'scratch-paint/stroke-style/CLEAR_STROKE_GRADIENT';
const DEFAULT_COLOR = '#000000';

import {CHANGE_STROKE_WIDTH} from './stroke-width';

const reducer = makeColorStyleReducer({
    addOtherStopAction: ADD_OTHER_STROKE_STOP,
    changeColorAction: CHANGE_STROKE_COLOR,
    changeGradientTypeAction: CHANGE_STROKE_GRADIENT_TYPE,
    clearGradientAction: CLEAR_STROKE_GRADIENT,
    defaultColor: DEFAULT_COLOR,
    selectionColorKey: 'strokeColor',
    selectionGradientTypeKey: 'strokeGradientType'
});

// This is mostly the same as the generated reducer, but with one piece of extra logic to set the color to null when the
// stroke width is set to 0.
// https://redux.js.org/recipes/structuring-reducers/reusing-reducer-logic
const strokeReducer = function (state, action) {
    if (action.type === CHANGE_STROKE_WIDTH && Math.max(action.strokeWidth, 0) === 0) {
        // TODO: this preserves the gradient type when you change the stroke width to 0.
        // Alternatively, we could set gradientType to SOLID instead of setting secondary to null, but since
        // the stroke width is automatically set to 0 as soon as a "null" color is detected (including a gradient for
        // which both colors are null), that would change the gradient type back to solid if you selected null for both
        // gradient colors.
        return {
            ...state,
            stops: [{
                color: 'rgba(0,0,0,0)',
                offset: 0
            }]
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

export {
    strokeReducer as default,
    addOtherStrokeStop,
    changeStrokeColor,
    changeStrokeGradientType,
    clearStrokeGradient,
    DEFAULT_COLOR,
    CHANGE_STROKE_GRADIENT_TYPE
};
