import { createAction } from "@ngrx/store";
import { VendorModel } from "../models";

export enum VendorsActionTypes {
    LoadVendors = '[Vendors] Load Vendors',
    LoadSingleVendor = '[Vendors] Load Single Vendor',
    LoadVendorsSuccess = '[Vendors] Load Vendors Success',
}

export const loadVendors = createAction(
    VendorsActionTypes.LoadVendors
);

export const loadSingleVendor = createAction(
    VendorsActionTypes.LoadSingleVendor,
    (id: string) => ({ id }),
);

export const loadVendorsSuccess = createAction(
    VendorsActionTypes.LoadVendorsSuccess,
    (vendors: VendorModel[]) => ({ vendors }),
);