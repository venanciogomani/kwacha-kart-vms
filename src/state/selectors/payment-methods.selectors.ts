import { createSelector, createFeatureSelector } from "@ngrx/store";
import { PaymentMethodState } from "../reducers/payment-methods.reducer";

export const selectPaymentMethodsState = createFeatureSelector<PaymentMethodState>("paymentMethods");

export const selectPaymentMethods = createSelector(
    selectPaymentMethodsState,
    (state: PaymentMethodState) => state.paymentMethods
);

export const selectPaymentMethodById = createSelector(
    selectPaymentMethodsState,
    (state: PaymentMethodState, id: string) => state.paymentMethods.find(pm => pm.id === id)
);

export const selectPaymentMethodsLoading = createSelector(
    selectPaymentMethodsState,
    (state: PaymentMethodState) => state.loading
);