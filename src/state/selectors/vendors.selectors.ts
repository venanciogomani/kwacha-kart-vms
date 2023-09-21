import { createSelector, createFeatureSelector } from "@ngrx/store";
import { VendorsState } from "../reducers/vendors.reducer";

export const selectVendorsState = createFeatureSelector<VendorsState>("vendors");

export const selectVendors = createSelector(
    selectVendorsState,
    (state: VendorsState) => state.vendors
);

export const selectVendorById = (id: string) => createSelector(
    selectVendorsState,
    (state: VendorsState) => state.vendors.find(vendor => vendor.id === id)
);

export const selectLoading = createSelector(
    selectVendorsState,
    (state: VendorsState) => state.loading
);