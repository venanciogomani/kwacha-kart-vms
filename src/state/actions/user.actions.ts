import { createAction } from "@ngrx/store";
import { UserModel } from "../models";

export enum UserActionTypes {
    LoadUsers = '[User] Load User',
    LoadUsersSuccess = '[User] Load User Success',
    LoadSingleUser = '[User] Load Single User',
    LoadSingleUserSuccess = '[User] Load Single User Success',
    LoadMyUser = '[User] Load My User',
    LoadMyUserSuccess = '[User] Load My User Success',
    addUser = '[User] Add User',
    addUserSuccess = '[User] Add User Success',
    EditUser = '[User] Edit User',
    EditUserSuccess = '[User] Edit User Success',
    DeleteUser = '[User] Delete User',
    DeleteUserSuccess = '[User] Delete User Success',
}

export const loadUsers = createAction(
    UserActionTypes.LoadUsers
);

export const loadUsersSuccess = createAction(
    UserActionTypes.LoadUsersSuccess,
    (users: UserModel[]) => ({ users }),
);

export const loadSingleUser = createAction(
    UserActionTypes.LoadSingleUser,
    (id: string) => ({ id }),
);

export const loadSingleUserSuccess = createAction(
    UserActionTypes.LoadSingleUserSuccess,
    (user: UserModel) => ({ user }),
);

export const loadMyUser = createAction(
    UserActionTypes.LoadMyUser
);

export const loadMyUserSuccess = createAction(
    UserActionTypes.LoadMyUserSuccess,
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