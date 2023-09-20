import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
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
}