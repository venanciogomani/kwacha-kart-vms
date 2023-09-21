import { createSelector, createFeatureSelector } from "@ngrx/store";
import { RolesState } from "../reducers/roles.reducer";

export const selectRolesState = createFeatureSelector<RolesState>("roles");

export const selectRoles = createSelector(
    selectRolesState,
    (state: RolesState) => state.roles
);

export const selectRoleById = (id: string) => createSelector(
    selectRolesState,
    (state: RolesState) => state.roles.find(role => role.id === id)
);

export const selectLoading = createSelector(
    selectRolesState,
    (state: RolesState) => state.loading
);