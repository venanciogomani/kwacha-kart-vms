import { createReducer, on } from "@ngrx/store";
import {
    loadAuth,
    loadAuthSuccess,
    editAuth,
    editAuthSuccess,
    deleteAuth,
    deleteAuthSuccess,
} from "../actions/auth.actions";
import { UserModel } from "../models";

export interface AuthState {
    auth: UserModel;
    loading: boolean;
}

export const initialState: AuthState = {
    auth: {} as UserModel,
    loading: false,
};

export const authReducer = createReducer(
    initialState,
    on(loadAuth, (state) => ({ ...state, loading: true })),
    on(loadAuthSuccess, (state, { auth }) => ({ ...state, auth, loading: false })),
    on(editAuth, (state) => ({ ...state, loading: true })),
    on(editAuthSuccess, (state, { auth }) => ({ ...state, auth, loading: false })),
    on(deleteAuth, (state) => ({ ...state, loading: true })),
    on(deleteAuthSuccess, (state, { auth }) => ({ ...state, auth, loading: false })),
);

export function reducer(state: AuthState, action: any) {
    return authReducer(state, action);
}