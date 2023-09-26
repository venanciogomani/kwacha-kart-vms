import { createAction } from "@ngrx/store";
import { StoreRoleModel } from "../models";

export enum RolesActionTypes {
    LoadRoles = '[Roles] Load Roles',
    LoadRolesSuccess = '[Roles] Load Roles Success',
    LoadSingleRole = '[Roles] Load Single Role',
    LoadSingleRoleSuccess = '[Roles] Load Single Role Success',
    AddRole = '[Roles] Add Role',
    AddRoleSuccess = '[Roles] Add Role Success',
    EditRole = '[Roles] Edit Role',
    EditRoleSuccess = '[Roles] Edit Role Success',
    DeleteRole = '[Roles] Delete Role',
    DeleteRoleSuccess = '[Roles] Delete Role Success',
}

export const loadRoles = createAction(
    RolesActionTypes.LoadRoles
);

export const loadRolesSuccess = createAction(
    RolesActionTypes.LoadRolesSuccess,
    (roles: StoreRoleModel[]) => ({ roles }),
);

export const loadSingleRole = createAction(
    RolesActionTypes.LoadSingleRole,
    (id: string) => ({ id }),
);

export const loadSingleRoleSuccess = createAction(
    RolesActionTypes.LoadSingleRoleSuccess,
    (role: StoreRoleModel) => ({ role }),
);

export const addRole = createAction(
    RolesActionTypes.AddRole,
    (role: StoreRoleModel) => ({ role }),
);

export const addRoleSuccess = createAction(
    RolesActionTypes.AddRoleSuccess,
    (role: StoreRoleModel) => ({ role }),
);

export const editRole = createAction(
    RolesActionTypes.EditRole,
    (role: StoreRoleModel) => ({ role }),
);

export const editRoleSuccess = createAction(
    RolesActionTypes.EditRoleSuccess,
    (role: StoreRoleModel) => ({ role }),
);

export const deleteRole = createAction(
    RolesActionTypes.DeleteRole,
    (id: string) => ({ id }),
);

export const deleteRoleSuccess = createAction(
    RolesActionTypes.DeleteRoleSuccess,
    (id: string) => ({ id }),
);