import { createAction } from "@ngrx/store";
import { UserModel } from "../models";

export enum UserActionTypes {
    LoadUser = '[User] Load User',
    LoadUserSuccess = '[User] Load User Success',
    addUser = '[User] Add User',
    addUserSuccess = '[User] Add User Success',
    EditUser = '[User] Edit User',
    EditUserSuccess = '[User] Edit User Success',
    DeleteUser = '[User] Delete User',
    DeleteUserSuccess = '[User] Delete User Success',
}

export const loadUser = createAction(
    UserActionTypes.LoadUser
);

export const loadUserSuccess = createAction(
    UserActionTypes.LoadUserSuccess,
    (user: UserModel) => ({ user }),
);

export const addUser = createAction(
    UserActionTypes.addUser,
    (user: UserModel) => ({ user }),
);

export const addUserSuccess = createAction(
    UserActionTypes.addUserSuccess,
    (user: UserModel) => ({ user }),
);

export const editUser = createAction(
    UserActionTypes.EditUser,
    (user: UserModel) => ({ user }),
);

export const editUserSuccess = createAction(
    UserActionTypes.EditUserSuccess,
    (user: UserModel) => ({ user }),
);

export const deleteUser = createAction(
    UserActionTypes.DeleteUser,
    (id: string) => ({ id }),
);

export const deleteUserSuccess = createAction(
    UserActionTypes.DeleteUserSuccess,
    (id: string) => ({ id }),
);