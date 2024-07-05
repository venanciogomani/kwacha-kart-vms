import { createReducer, on } from "@ngrx/store";
import {
    loadDeliveryMethod,
    loadDeliveryMethodSuccess,
    loadDeliveryMethodFailure,
    createDeliveryMethod,
    createDeliveryMethodSuccess,
    createDeliveryMethodFailure,
    updateDeliveryMethod,
    updateDeliveryMethodSuccess,
    updateDeliveryMethodFailure,
    deleteDeliveryMethod,
    deleteDeliveryMethodSuccess,
    deleteDeliveryMethodFailure
} from "../actions/delivery-methods.actions";
import { DeliveryMethodModel } from "../models";

export interface DeliveryMethodState {
    deliveryMethods: DeliveryMethodModel[];
    loading: boolean;
}

const initialState: DeliveryMethodState = {
    deliveryMethods: [],
    loading: false
};

export const deliveryMethodReducer = createReducer(
    initialState,
    on(loadDeliveryMethod, (state) => ({ ...state, loading: true })),
    on(loadDeliveryMethodSuccess, (state, { deliveryMethods }) => ({
        ...state,
        deliveryMethods,
        loading: false
    })),
    on(loadDeliveryMethodFailure, (state, { error }) => ({
        ...state,
        loading: false
    })),
    on(createDeliveryMethod, (state) => ({ ...state, loading: true })),
    on(createDeliveryMethodSuccess, (state, { deliveryMethod }) => ({
        ...state,
        deliveryMethods: [...state.deliveryMethods, deliveryMethod],
        loading: false
    })),
    on(createDeliveryMethodFailure, (state, { error }) => ({
        ...state,
        loading: false
    })),
    on(updateDeliveryMethod, (state) => ({ ...state, loading: true })),
    on(updateDeliveryMethodSuccess, (state, { deliveryMethod }) => ({
        ...state,
        deliveryMethods: state.deliveryMethods.map((dm) =>
            dm.id === deliveryMethod.id ? deliveryMethod : dm
        ),
        loading: false
    })),
    on(updateDeliveryMethodFailure, (state, { error }) => ({
        ...state,
        loading: false
    })),
    on(deleteDeliveryMethod, (state) => ({ ...state, loading: true })),
    on(deleteDeliveryMethodSuccess, (state, { deliveryMethodId }) => ({
        ...state,
        deliveryMethods: state.deliveryMethods.filter(
            (pm) => pm.id !== deliveryMethodId
        ),
        loading: false
    }))
);

export function reducer(state: DeliveryMethodState | undefined, action: any) {
    return deliveryMethodReducer(state, action);
}