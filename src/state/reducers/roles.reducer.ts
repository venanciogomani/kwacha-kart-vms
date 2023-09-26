import { createReducer, on } from "@ngrx/store";
import { 
    loadRoles, 
    loadSingleRole,
    loadRolesSuccess,
    loadSingleRoleSuccess,
    addRole,
    addRoleSuccess,
    editRole,
    editRoleSuccess,
    deleteRole,
    deleteRoleSuccess, 
} from "../actions/roles.actions";
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
    on(loadRolesSuccess, (state, { roles }) => ({ ...state, roles: roles, loading: false })),
    on(loadSingleRole, (state) => ({ ...state, loading: true })),
    on(loadSingleRoleSuccess, (state, { role }) => ({ ...state, roles: [...state.roles, role], loading: false })),
    on(addRole, (state) => ({ ...state, loading: true })),
    on(addRoleSuccess, (state, { role }) => ({ ...state, roles: [...state.roles, role], loading: false })),
    on(editRole, (state) => ({ ...state, loading: true })),
    on(editRoleSuccess, (state, { role }) => ({ ...state, roles: [...state.roles, role], loading: false })),
    on(deleteRole, (state) => ({ ...state, loading: true })),
    on(deleteRoleSuccess, (state, { id }) => ({ ...state, roles: state.roles.filter(role => role.id !== id), loading: false })),
);

export function reducer(state: RolesState | undefined, action: any) {
    return rolesReducer(state, action);
}