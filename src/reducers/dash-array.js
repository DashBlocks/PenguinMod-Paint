import log from '../log/log';

const ADD_VALUE = 'scratch-paint/dash-array/ADD_VALUE';
const CHANGE_VALUE = 'scratch-paint/dash-array/CHANGE_VALUE';
const DELETE_VALUE = 'scratch-paint/dash-array/DELETE_VALUE';
const initialState = [];

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case ADD_VALUE: {
            state.push(0);
            return state;
        }
        case CHANGE_VALUE: {
            if (isNaN(action.index)) {
                log.warn(`Invalid index: ${action.index}`);
                return state;
            }
            if (isNaN(action.value)) {
                log.warn(`Invalid value setting: ${action.value}`);
                return state;
            }
            state[Math.max(0, Math.min(state.length - 1, action.index))] = Math.max(0, action.value);
            return state;
        }
        case DELETE_VALUE: {
            if (isNaN(action.index)) {
                log.warn(`Invalid index: ${action.index}`);
                return state;
            }
            state.splice(Math.max(0, Math.min(state.length - 1, action.index)), 1);
            return state;
        }
        default:
            return state;
    }
};

// Action creators ==================================
const addValue = function () {
    return {
        type: ADD_VALUE
    };
};

const changeValue = function (index, value) {
    return {
        type: CHANGE_VALUE,
        index: index,
        value: value
    };
};

const deleteValue = function (index) {
    return {
        type: DELETE_VALUE,
        index: index
    };
};

export {
    reducer as default,
    addValue,
    changeValue,
    deleteValue
};
