import { createSelector, createFeatureSelector } from "@ngrx/store";
import { StoresState } from "../reducers/stores.reducer";

export const selectStoresState = createFeatureSelector<StoresState>("stores");

export const selectStores = createSelector(
    selectStoresState,
    (state: StoresState) => state.stores
);

export const selectStoreById = (id: string) => createSelector(
    selectStoresState,
    (state: StoresState) => state.stores.find(store => store.id === id)
);

export const selectLoading = createSelector(
    selectStoresState,
    (state: StoresState) => state.loading
);