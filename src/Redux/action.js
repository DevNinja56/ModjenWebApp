import { Alert } from 'react-native'
export const AUTH_LOADING = "AUTH_LOADING";
export const IS_FIRST = "IS_FIRST";
export const USER_LOGIN = "USER_LOGIN";


export const isFirstTime = (value) => {
    return dispatch => {
        dispatch({
            type: IS_FIRST,
            payload: {
                isFirst: value
            }
        })
    }
}
