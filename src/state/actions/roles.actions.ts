import { createAction } from "@ngrx/store";
import { StoreRoleModel } from "../models";

export enum RolesActionTypes {
    LoadRoles = '[Roles] Load Roles',
    LoadSingleRole = '[Roles] Load Single Role',
    LoadRolesSuccess = '[Roles] Load Roles Success',
}

export const loadRoles = createAction(
    RolesActionTypes.LoadRoles
);

export const loadSingleRole = createAction(
    RolesActionTypes.LoadSingleRole,
    (id: string) => ({ id }),
);

export const loadRolesSuccess = createAction(
    RolesActionTypes.LoadRolesSuccess,
    (roles: StoreRoleModel[]) => ({ roles }),
);