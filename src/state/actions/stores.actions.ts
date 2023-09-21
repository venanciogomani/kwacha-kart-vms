import { createAction } from "@ngrx/store";
import { StoresModel } from "../models";

export enum StoresActionTypes {
    LoadStores = '[Stores] Load Stores',
    LoadSingleStore = '[Stores] Load Single Store',
    LoadStoresSuccess = '[Stores] Load Stores Success',
}

export const loadStores = createAction(
    StoresActionTypes.LoadStores
);

export const loadSingleStore = createAction(
    StoresActionTypes.LoadSingleStore,
    (id: string) => ({ id }),
);

export const loadStoresSuccess = createAction(
    StoresActionTypes.LoadStoresSuccess,
    (stores: StoresModel[]) => ({ stores }),
);