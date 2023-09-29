import { createSelector, createFeatureSelector } from "@ngrx/store";
import { AuthState } from "../reducers/auth.reducer";

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuth = createSelector(
    selectAuthState,
    (state: AuthState) => state.auth,
);

export const selectAuthLoading = createSelector(
    selectAuthState,
    (state: AuthState) => state.loading,
);