import { createReducer, on } from '@ngrx/store';
import { loadVendors, loadSingleVendor, loadVendorsSuccess } from '../actions/vendors.actions';
import { VendorModel } from '../models';

export interface VendorsState {
    vendors: VendorModel[];
    loading: boolean;
}

export const initialState: VendorsState = {
    vendors: [],
    loading: false,
};

export const vendorsReducer = createReducer(
    initialState,
    on(loadVendors, (state) => ({ ...state, loading: true })),
    on(loadSingleVendor, (state) => ({ ...state, loading: true })),
    on(loadVendorsSuccess, (state, { vendors }) => ({ ...state, vendors: vendors, loading: false })),
);

export function reducer(state: VendorsState | undefined, action: any) {
    return vendorsReducer(state, action);
}