import { createAction } from "@ngrx/store";
import { StoresModel } from "../models";

export enum StoresActionTypes {
    LoadStores = '[Stores] Load Stores',
    LoadStoresSuccess = '[Stores] Load Stores Success',
    LoadSingleStore = '[Stores] Load Single Store',
    LoadSingleStoreSuccess = '[Stores] Load Single Store Success',
    AddStore = '[Stores] Add Store',
    AddStoreSuccess = '[Stores] Add Store Success',
    EditStore = '[Stores] Edit Store',
    EditStoreSuccess = '[Stores] Edit Store Success',
    DeleteStore = '[Stores] Delete Store',
    DeleteStoreSuccess = '[Stores] Delete Store Success',
}

export const loadStores = createAction(
    StoresActionTypes.LoadStores
);

export const loadStoresSuccess = createAction(
    StoresActionTypes.LoadStoresSuccess,
    (stores: StoresModel[]) => ({ stores }),
    );
    
export const loadSingleStore = createAction(
    StoresActionTypes.LoadSingleStore,
    (id: string) => ({ id }),
);

export const loadSingleStoreSuccess = createAction(
    StoresActionTypes.LoadSingleStoreSuccess,
    (store: StoresModel) => ({ store }),
);

export const addStore = createAction(
    StoresActionTypes.AddStore,
    (store: StoresModel) => ({ store }),
);

export const addStoreSuccess = createAction(
    StoresActionTypes.AddStoreSuccess,
    (store: StoresModel) => ({ store }),
);

export const editStore = createAction(
    StoresActionTypes.EditStore,
    (store: StoresModel) => ({ store }),
);

export const editStoreSuccess = createAction(
    StoresActionTypes.EditStoreSuccess,
    (store: StoresModel) => ({ store }),
);

export const deleteStore = createAction(
    StoresActionTypes.DeleteStore,
    (id: string) => ({ id }),
);

export const deleteStoreSuccess = createAction(
    StoresActionTypes.DeleteStoreSuccess,
    (id: string) => ({ id }),
);