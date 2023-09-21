import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { StoresModel } from "src/state";
import { loadStoresSuccess } from "src/state/actions/stores.actions";
import { Stores, Vendors, Plans } from "src/state/dataset";
import { StoresState } from "src/state/reducers/stores.reducer";

@Injectable(
    { providedIn: "root" }
)

export class StoreApiService {
    constructor(
        private store: Store<StoresState>
    ) { }

    createInitialStoresState() {
        const initialState: StoresState = {
            stores: Stores,
            loading: false
        }
        
        this.store.dispatch(loadStoresSuccess(initialState.stores));
    }

    getStoreById(id: string): StoresModel {
        return Stores.find(store => store.id === id) || {} as StoresModel;
    }

    getStoreByVendorId(vendorId: string): StoresModel[] {
        return Stores.filter(store => store.vendorId === vendorId);
    }

    getStoreByPlanId(planId: string): StoresModel[] {
        return Stores.filter(store => store.planId === planId);
    }

    getStores(): StoresModel[] {
        return Stores;
    }
}