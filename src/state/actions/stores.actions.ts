import { createAction } from "@ngrx/store";
import { StoresModel } from "../models";

export enum StoresActionTypes {
    LoadStores = '[Stores] Load Stores',
    LoadStoresSuccess = '[Stores] Load Stores Success',
}

export const loadStores = createAction(
    StoresActionTypes.LoadStores
);
export const loadStoresSuccess = createAction(
    StoresActionTypes.LoadStoresSuccess,
    (stores: StoresModel[]) => ({ stores }),
);