import { createReducer, on } from "@ngrx/store";
import { loadStores, loadSingleStore, loadStoresSuccess } from "../actions/stores.actions";
import { StoresModel } from "../models";

export interface StoresState {
    stores: StoresModel[];
    loading: boolean;
}

export const initialState: StoresState = {
    stores: [],
    loading: false,
};

export const storesReducer = createReducer(
    initialState,
    on(loadStores, (state) => ({ ...state, loading: true })),
    on(loadSingleStore, (state) => ({ ...state, loading: true })),
    on(loadStoresSuccess, (state, { stores }) => ({ ...state, stores: stores, loading: false })),
);

export function reducer(state: StoresState | undefined, action: any) {
    return storesReducer(state, action);
}