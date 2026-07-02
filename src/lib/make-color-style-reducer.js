import log from '../log/log';
import {CHANGE_SELECTED_ITEMS} from '../reducers/selected-items';
import {getColorsFromSelection, MIXED} from '../helper/style-path';
import GradientTypes from './gradient-types';

// Matches hex colors
const hexRegex = /^#[0-9a-f]{3,8}$/i;

const isValidHexColor = color => {
    if (!hexRegex.test(color) && color !== null && color !== MIXED) {
        log.warn(`Invalid hex color code: ${color}`);
        return false;
    }
    return true;
};

const makeColorStyleReducer = ({
    // Action name for adding the gradient stop
    addOtherStopAction,
    // Action name for changing the color
    changeColorAction,
    // Action name for changing the gradient type
    changeGradientTypeAction,
    // Action name for clearing the gradient
    clearGradientAction,
    // Initial color when not set
    defaultColor,
    // The name of the property read from getColorsFromSelection to get the color.
    // e.g. `fillColor` or `strokeColor`.
    selectionColorKey,
    // The name of the property read from getColorsFromSelection to get the gradient type.
    // e.g. `fillGradientType` or `strokeGradientType`.
    selectionGradientTypeKey
}) => function colorReducer (state, action) {
    if (typeof state === 'undefined') {
        state = {
            stops: [{
                color: defaultColor,
                offset: 0
            }],
            gradientType: GradientTypes.SOLID
        };
    }
    switch (action.type) {
    case addOtherStopAction: {
        if (action.index < 0 || action.index >= state.stops.length) {
            log.warn(`Stop with index ${action.index} does not exist`);
            return state;
        }
        if (!isValidHexColor(action.color)) return state;

        if (state.stops.length < 2) {
            return {
                ...state,
                stops: state.stops.concat({
                    color: action.color,
                    offset: 1
                })
            };
        }
        
        const insertIdx = action.index < state.stops.length - 1 ? action.index + 1 : action.index;
        return {
            ...state,
            stops: state.stops.toSpliced(insertIdx, 0, {
                color: action.color,
                offset: (state.stops[insertIdx - 1].offset + state.stops[insertIdx].offset) / 2
            })
        };
    }
    case changeColorAction:
        if (action.index < 0 || action.index >= state.stops.length) {
            log.warn(`Stop with index ${action.index} does not exist`);
            return state;
        }
        if (!isValidHexColor(action.color)) return state;
        return {
            ...state,
            stops: state.stops.toSpliced(action.index, 1, {
                color: action.color,
                offset: state.stops[action.index].offset
            })
        };
    case CHANGE_SELECTED_ITEMS: {
        // Don't change state if no selection
        if (!action.selectedItems || !action.selectedItems.length) {
            return state;
        }
        const colors = getColorsFromSelection(action.selectedItems, action.bitmapMode);

        // Only set the primary color + gradient type if they exist in what getColorsFromSelection gave us.
        // E.g. in bitmap mode, getColorsFromSelection will not return stroke color/gradient type. This allows us to
        // preserve stroke swatch state across bitmap mode-- if getColorsFromSelection set them to null, then selecting
        // anything in bitmap mode would overwrite the stroke state.
        const newState = {...state};
        if (selectionColorKey in colors) {
            if (Array.isArray(colors[selectionColorKey])) {
                newState.stops = colors[selectionColorKey];
            } else {
                newState.stops = [{
                    color: colors[selectionColorKey],
                    offset: 0
                }];
            }
        }
        if (selectionGradientTypeKey in colors) {
            newState.gradientType = colors[selectionGradientTypeKey];
        }
        return newState;
    }
    case changeGradientTypeAction:
        if (action.gradientType in GradientTypes) {
            if (state.gradientType !== GradientTypes.SOLID && action.gradientType === GradientTypes.SOLID) {
                return {
                    ...state,
                    stops: [{
                        color: state.stops[0].color,
                        offset: 0
                    }],
                    gradientType: action.gradientType
                };
            }
            return {...state, gradientType: action.gradientType};
        }
        log.warn(`Gradient type does not exist: ${action.gradientType}`);
        return state;
    case clearGradientAction:
        return {
            ...state,
            stops: [{
                color: state.stops[0].color,
                offset: 0
            }],
            gradientType: GradientTypes.SOLID
        };
    default:
        return state;
    }
};

export default makeColorStyleReducer;
