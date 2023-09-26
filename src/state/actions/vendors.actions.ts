import { createAction } from "@ngrx/store";
import { VendorModel } from "../models";

export enum VendorsActionTypes {
    LoadVendors = '[Vendors] Load Vendors',
    LoadVendorsSuccess = '[Vendors] Load Vendors Success',
    LoadSingleVendor = '[Vendors] Load Single Vendor',
    LoadSingleVendorSuccess = '[Vendors] Load Single Vendor Success',
    AddVendor = '[Vendors] Add Vendor',
    AddVendorSuccess = '[Vendors] Add Vendor Success',
    EditVendor = '[Vendors] Edit Vendor',
    EditVendorSuccess = '[Vendors] Edit Vendor Success',
    DeleteVendor = '[Vendors] Delete Vendor',
    DeleteVendorSuccess = '[Vendors] Delete Vendor Success',
}

export const loadVendors = createAction(
    VendorsActionTypes.LoadVendors
);

export const loadVendorsSuccess = createAction(
    VendorsActionTypes.LoadVendorsSuccess,
    (vendors: VendorModel[]) => ({ vendors }),
);

export const loadSingleVendor = createAction(
    VendorsActionTypes.LoadSingleVendor,
    (id: string) => ({ id }),
);

export const loadSingleVendorSuccess = createAction(
    VendorsActionTypes.LoadSingleVendorSuccess,
    (vendor: VendorModel) => ({ vendor }),
);

export const addVendor = createAction(
    VendorsActionTypes.AddVendor,
    (vendor: VendorModel) => ({ vendor }),
);

export const addVendorSuccess = createAction(
    VendorsActionTypes.AddVendorSuccess,
    (vendor: VendorModel) => ({ vendor }),
);

export const editVendor = createAction(
    VendorsActionTypes.EditVendor,
    (vendor: VendorModel) => ({ vendor }),
);

export const editVendorSuccess = createAction(
    VendorsActionTypes.EditVendorSuccess,
    (vendor: VendorModel) => ({ vendor }),
);

export const deleteVendor = createAction(
    VendorsActionTypes.DeleteVendor,
    (id: string) => ({ id }),
);

export const deleteVendorSuccess = createAction(
    VendorsActionTypes.DeleteVendorSuccess,
    (id: string) => ({ id }),
);