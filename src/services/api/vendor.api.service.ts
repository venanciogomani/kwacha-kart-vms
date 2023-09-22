import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { VendorModel } from "src/state";
import { loadVendorsSuccess } from "src/state/actions/vendors.actions";
import { Vendors } from "src/state/dataset";
import { VendorsState } from "src/state/reducers/vendors.reducer";

@Injectable (
    {providedIn: "root"}
)

export class VendorApiService {
    constructor(
        private store: Store<VendorsState>
    ) { }

    createInitialVendorsState() {
        const initialState: VendorsState = {
            vendors: Vendors,
            loading: false
        }

        this.store.dispatch(loadVendorsSuccess(initialState.vendors));
    }

    getAllVendors() {
        return Vendors;
    }

    getVendorById(id: string): VendorModel {
        const vendor = Vendors.filter(vendor => vendor.id === id);

        if (vendor.length === 0) {
            return {} as VendorModel;
        }

        return vendor[0];
    }

    getVendorsByRoleId(roleId: string): VendorModel[] {
        const vendor = Vendors.filter(vendor => vendor.roleId === roleId);

        if (vendor.length === 0) {
            return [];
        }
        
        return vendor;
    }

    getVendorsByStoreId(storeId: string): VendorModel[] {
        const vendor = Vendors.filter(vendor => vendor.storeId === storeId);

        if (vendor.length === 0) {
            return [];
        }
        
        return vendor;
    }
}