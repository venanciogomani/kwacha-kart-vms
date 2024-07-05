import { createSelector, createFeatureSelector } from "@ngrx/store";
import { DeliveryMethodState } from "../reducers/delivery-methods.reducer";

export const selectDeliveryMethodsState = createFeatureSelector<DeliveryMethodState>("deliveryMethods");

export const selectDeliveryMethods = createSelector(
    selectDeliveryMethodsState,
    (state: DeliveryMethodState) => state.deliveryMethods
);

export const selectDeliveryMethodById = createSelector(
    selectDeliveryMethodsState,
    (state: DeliveryMethodState, id: string) => state.deliveryMethods.find(dm => dm.id === id)
);

export const selectDeliveryMethodsLoading = createSelector(
    selectDeliveryMethodsState,
    (state: DeliveryMethodState) => state.loading
);