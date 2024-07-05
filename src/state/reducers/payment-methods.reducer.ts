import { createReducer, on } from "@ngrx/store";
import {
    loadPaymentMethod,
    loadPaymentMethodSuccess,
    loadPaymentMethodFailure,
    createPaymentMethod,
    createPaymentMethodSuccess,
    createPaymentMethodFailure,
    updatePaymentMethod,
    updatePaymentMethodSuccess,
    updatePaymentMethodFailure,
    deletePaymentMethod,
    deletePaymentMethodSuccess,
    deletePaymentMethodFailure
} from "../actions/payment-methods.actions";
import { PaymentMethodModel } from "../models";

export interface PaymentMethodState {
    paymentMethods: PaymentMethodModel[];
    loading: boolean;
}

const initialState: PaymentMethodState = {
    paymentMethods: [],
    loading: false
};

export const paymentMethodReducer = createReducer(
    initialState,
    on(loadPaymentMethod, (state) => ({ ...state, loading: true })),
    on(loadPaymentMethodSuccess, (state, { paymentMethods }) => ({
        ...state,
        paymentMethods,
        loading: false
    })),
    on(loadPaymentMethodFailure, (state, { error }) => ({
        ...state,
        loading: false
    })),
    on(createPaymentMethod, (state) => ({ ...state, loading: true })),
    on(createPaymentMethodSuccess, (state, { paymentMethod }) => ({
        ...state,
        paymentMethods: [...state.paymentMethods, paymentMethod],
        loading: false
    })),
    on(createPaymentMethodFailure, (state, { error }) => ({
        ...state,
        loading: false
    })),
    on(updatePaymentMethod, (state) => ({ ...state, loading: true })),
    on(updatePaymentMethodSuccess, (state, { paymentMethod }) => ({
        ...state,
        paymentMethods: state.paymentMethods.map((pm) =>
            pm.id === paymentMethod.id ? paymentMethod : pm
        ),
        loading: false
    })),
    on(updatePaymentMethodFailure, (state, { error }) => ({
        ...state,
        loading: false
    })),
    on(deletePaymentMethod, (state) => ({ ...state, loading: true })),
    on(deletePaymentMethodSuccess, (state, { paymentMethodId }) => ({
        ...state,
        paymentMethods: state.paymentMethods.filter(
            (pm) => pm.id !== paymentMethodId
        ),
        loading: false
    }))
);

export function reducer(state: PaymentMethodState | undefined, action: any) {
    return paymentMethodReducer(state, action);
}