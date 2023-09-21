import { createReducer, on } from "@ngrx/store";
import { loadRoles, loadRolesSuccess, loadSingleRole } from "../actions/roles.actions";
import { StoreRoleModel } from "../models";

export interface RolesState {
    roles: StoreRoleModel[];
    loading: boolean;
}

export const initialState: RolesState = {
    roles: [],
    loading: false,
};

export const rolesReducer = createReducer(
    initialState,
    on(loadRoles, (state) => ({ ...state, loading: true })),
    on(loadSingleRole, (state) => ({ ...state, loading: true })),
    on(loadRolesSuccess, (state, { roles }) => ({ ...state, roles: roles, loading: false })),
);

export function reducer(state: RolesState | undefined, action: any) {
    return rolesReducer(state, action);
}