import { createReducer, on } from '@ngrx/store';
import { 
    loadVendors, 
    loadVendorsSuccess, 
    loadSingleVendor, 
    loadSingleVendorSuccess,
    addVendor,
    addVendorSuccess,
    editVendor,
    editVendorSuccess,
    deleteVendor,
    deleteVendorSuccess,
} from '../actions/vendors.actions';
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
    on(loadVendorsSuccess, (state, { vendors }) => ({ ...state, vendors: vendors, loading: false })),
    on(loadSingleVendor, (state) => ({ ...state, loading: true })),
    on(loadSingleVendorSuccess, (state, { vendor }) => ({ ...state, vendors: [...state.vendors, vendor], loading: false })),
    on(addVendor, (state) => ({ ...state, loading: true })),
    on(addVendorSuccess, (state, { vendor }) => ({ ...state, vendors: [...state.vendors, vendor], loading: false })),
    on(editVendor, (state) => ({ ...state, loading: true })),
    on(editVendorSuccess, (state, { vendor }) => ({ ...state, vendors: [...state.vendors, vendor], loading: false })),
    on(deleteVendor, (state) => ({ ...state, loading: true })),
    on(deleteVendorSuccess, (state, { id }) => ({ ...state, vendors: state.vendors.filter(vendor => vendor.id !== id), loading: false })),
);

export function reducer(state: VendorsState | undefined, action: any) {
    return vendorsReducer(state, action);
}