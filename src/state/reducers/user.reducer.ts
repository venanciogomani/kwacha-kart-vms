import { createReducer, on } from "@ngrx/store";
import { 
    loadUser, 
    loadUserSuccess,
    addUser,
    addUserSuccess,
    editUser,
    editUserSuccess,
    deleteUser,
    deleteUserSuccess, 
} from "../actions/user.actions";
import { UserModel } from "../models";

export interface UserState {
    user: UserModel;
    loading: boolean;
}

export const initialState: UserState = {
    user: {} as UserModel,
    loading: false,
};

export const userReducer = createReducer(
    initialState,
    on(loadUser, (state) => ({ ...state, loading: true })),
    on(loadUserSuccess, (state, { user }) => ({ ...state, user: user, loading: false })),
    on(addUser, (state) => ({ ...state, loading: true })),
    on(addUserSuccess, (state, { user }) => ({ ...state, user: user, loading: false })),
    on(editUser, (state) => ({ ...state, loading: true })),
    on(editUserSuccess, (state, { user }) => ({ ...state, user: user, loading: false })),
    on(deleteUser, (state) => ({ ...state, loading: true })),
    on(deleteUserSuccess, (state, { id }) => ({ ...state, user: {} as UserModel, loading: false })),
);

export function reducer(state: UserState | undefined, action: any) {
    return userReducer(state, action);
}