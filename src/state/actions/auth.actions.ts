import { createAction } from "@ngrx/store";
import { UserModel } from "../models";

export enum UserActionTypes {
    LoadAuth = '[Auth] Load Auth',
    LoadAuthSuccess = '[Auth] Load Auth Success',
    EditAuth = '[Auth] Edit Auth',
    EditAuthSuccess = '[Auth] Edit Auth Success',
    DeleteAuth = '[Auth] Delete Auth',
    DeleteAuthSuccess = '[Auth] Delete Auth Success',
}

export const loadAuth = createAction(
    UserActionTypes.LoadAuth
);

export const loadAuthSuccess = createAction(
    UserActionTypes.LoadAuthSuccess,
    (auth: UserModel) => ({ auth }),
);

export const editAuth = createAction(
    UserActionTypes.EditAuth,
    (auth: UserModel) => ({ auth }),
);

export const editAuthSuccess = createAction(
    UserActionTypes.EditAuthSuccess,
    (auth: UserModel) => ({ auth }),
);

export const deleteAuth = createAction(
    UserActionTypes.DeleteAuth,
    (auth: UserModel) => ({ auth }),
);

export const deleteAuthSuccess = createAction(
    UserActionTypes.DeleteAuthSuccess,
    (auth: UserModel) => ({ auth }),
);