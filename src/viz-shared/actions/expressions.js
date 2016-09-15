export const ADD_EXPRESSION = 'add-expression';
export const REMOVE_EXPRESSION = 'remove-expression';
export const UPDATE_EXPRESSION = 'update-expression';
export const SET_EXPRESSION_ENABLED = 'set-expression-enabled';

export const addExpression = ({ ...props }) => ({
    ...props, type: ADD_EXPRESSION
});

export const removeExpression = ({ ...props }) => ({
    ...props, type: REMOVE_EXPRESSION
});

export const updateExpression = ({ ...props }) => ({
    ...props, type: UPDATE_EXPRESSION
});

export const setExpressionEnabled = ({ ...props }) => ({
    ...props, type: SET_EXPRESSION_ENABLED
});