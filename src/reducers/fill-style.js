import makeColorStyleReducer from '../lib/make-color-style-reducer';

const CHANGE_FILL_COLOR = 'scratch-paint/fill-style/CHANGE_FILL_COLOR';
const CHANGE_FILL_GRADIENT_TYPE = 'scratch-paint/fill-style/CHANGE_FILL_GRADIENT_TYPE';
const CLEAR_FILL_GRADIENT = 'scratch-paint/fill-style/CLEAR_FILL_GRADIENT';
const DEFAULT_COLOR = '#9966FF';

const reducer = makeColorStyleReducer({
    changeColorAction: CHANGE_FILL_COLOR,
    changeGradientTypeAction: CHANGE_FILL_GRADIENT_TYPE,
    clearGradientAction: CLEAR_FILL_GRADIENT,
    defaultColor: DEFAULT_COLOR,
    selectionColorKey: 'fillColor',
    selectionGradientTypeKey: 'fillGradientType'
});

// Action creators ==================================
const changeFillColor = function (fillColor, index) {
    return {
        type: CHANGE_FILL_COLOR,
        color: fillColor,
        index
    };
};

const changeFillGradientType = function (gradientType) {
    return {
        type: CHANGE_FILL_GRADIENT_TYPE,
        gradientType
    };
};

const clearFillGradient = function () {
    return {
        type: CLEAR_FILL_GRADIENT
    };
};

export {
    reducer as default,
    changeFillColor,
    changeFillGradientType,
    clearFillGradient,
    DEFAULT_COLOR,
    CHANGE_FILL_GRADIENT_TYPE
};
