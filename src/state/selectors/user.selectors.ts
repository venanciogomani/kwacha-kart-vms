import { createSelector, createFeatureSelector } from "@ngrx/store";
import { UserState } from "../reducers/user.reducer";

export const selectUserState = createFeatureSelector<UserState>("user");

export const selectUsers = createSelector(
    selectUserState,
    (state: UserState) => state.users
);

export const selectUsersLoading = createSelector(
    selectUserState,
    (state: UserState) => state.loading
);

export const selectMyUser = createSelector(
    selectUserState,
    (state: UserState) => state.users[0]
);