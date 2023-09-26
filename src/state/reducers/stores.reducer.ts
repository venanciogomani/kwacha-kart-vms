import { createReducer, on } from "@ngrx/store";
import { 
    loadStores, 
    loadStoresSuccess, 
    loadSingleStore,
    loadSingleStoreSuccess,
    addStore,
    addStoreSuccess,
    editStore,
    editStoreSuccess,
    deleteStore,
    deleteStoreSuccess, 
} from "../actions/stores.actions";
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
    on(loadStoresSuccess, (state, { stores }) => ({ ...state, stores: stores, loading: false })),
    on(loadSingleStore, (state) => ({ ...state, loading: true })),
    on(loadSingleStoreSuccess, (state, { store }) => ({ ...state, stores: [...state.stores, store], loading: false })),
    on(addStore, (state) => ({ ...state, loading: true })),
    on(addStoreSuccess, (state, { store }) => ({ ...state, stores: [...state.stores, store], loading: false })),
    on(editStore, (state) => ({ ...state, loading: true })),
    on(editStoreSuccess, (state, { store }) => ({ ...state, stores: [...state.stores, store], loading: false })),
    on(deleteStore, (state) => ({ ...state, loading: true })),
    on(deleteStoreSuccess, (state, { id }) => ({ ...state, stores: state.stores.filter(store => store.id !== id), loading: false })),
);

export function reducer(state: StoresState | undefined, action: any) {
    return storesReducer(state, action);
}