import { createReducer, on } from "@ngrx/store";
import { 
    loadUsers, 
    loadUsersSuccess,
    loadSingleUser,
    loadSingleUserSuccess,
    loadMyUser,
    loadMyUserSuccess,
    addUser,
    addUserSuccess,
    editUser,
    editUserSuccess,
    deleteUser,
    deleteUserSuccess, 
} from "../actions/user.actions";
import { UserModel } from "../models";

export interface UserState {
    users: UserModel[];
    loading: boolean;
}

export const initialState: UserState = {
    users: [],
    loading: false,
};

export const userReducer = createReducer(
    initialState,
    on(loadUsers, (state) => ({ ...state, loading: true })),
    on(loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false })),
    on(loadSingleUser, (state) => ({ ...state, loading: true })),
    on(loadSingleUserSuccess, (state, { user }) => ({ ...state, users: [...state.users, user], loading: false })),
    on(loadMyUser, (state) => ({ ...state, loading: true })),
    on(loadMyUserSuccess, (state, { user }) => ({ ...state, users: [...state.users, user], loading: false })),
    on(addUser, (state) => ({ ...state, loading: true })),
    on(addUserSuccess, (state, { user }) => ({ ...state, users: [...state.users, user], loading: false })),
    on(editUser, (state) => ({ ...state, loading: true })),
    on(editUserSuccess, (state, { user }) => ({ ...state, users: [...state.users, user], loading: false })),
    on(deleteUser, (state) => ({ ...state, loading: true })),
    on(deleteUserSuccess, (state, { id }) => ({ ...state, users: state.users.filter(user => user.id !== id), loading: false })),
);

export function reducer(state: UserState | undefined, action: any) {
    return userReducer(state, action);
}