import { Injectable } from "@angular/core";
import { VendorModel } from "src/state";
import { Vendors } from "src/state/dataset";

@Injectable (
    {providedIn: "root"}
)

export class VendorApiService {
    constructor() { }

    getVendorById(id: string) {
        const vendor = Vendors.filter(vendor => vendor.id === id);

        if (vendor.length === 0) {
            return null;
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
}