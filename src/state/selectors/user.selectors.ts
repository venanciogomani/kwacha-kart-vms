import { createSelector, createFeatureSelector } from "@ngrx/store";
import { UserState } from "../reducers/user.reducer";

export const selectUserState = createFeatureSelector<UserState>("user");

export const selectUser = createSelector(
    selectUserState,
    (state: UserState) => state.user
);

export const selectLoading = createSelector(
    selectUserState,
    (state: UserState) => state.loading
);