import { createSelector, createFeatureSelector } from "@ngrx/store";
import { OrdersState } from "../reducers/orders.reducer";

export const selectOrdersState = createFeatureSelector<OrdersState>("orders");

export const selectOrders = createSelector(
    selectOrdersState,
    (state: OrdersState) => state.orders
);

export const selectOrderById = (id: string) => createSelector(
    selectOrdersState,
    (state: OrdersState) => state.orders.find(order => order.id === id)
);

export const selectLoading = createSelector(
    selectOrdersState,
    (state: OrdersState) => state.loading
);