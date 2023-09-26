import { createReducer, on } from "@ngrx/store";
import { 
    loadOrders, 
    loadOrdersSuccess, 
    loadSingleOrder ,
    loadSingleOrderSuccess,
    addOrder,
    addOrderSuccess,
    editOrder,
    editOrderSuccess,
    deleteOrder,
    deleteOrderSuccess,
} from "../actions/orders.actions";
import { VendorOrderModel } from "../models";

export interface OrdersState {
    orders: VendorOrderModel[];
    loading: boolean;
}

export const initialState: OrdersState = {
    orders: [],
    loading: false,
};

export const ordersReducer = createReducer(
    initialState,
    on(loadOrders, (state) => ({ ...state, loading: true })),
    on(loadOrdersSuccess, (state, { orders }) => ({ ...state, orders: orders, loading: false })),
    on(loadSingleOrder, (state) => ({ ...state, loading: true })),
    on(loadSingleOrderSuccess, (state, { order }) => ({ ...state, orders: [...state.orders, order], loading: false })),
    on(addOrder, (state) => ({ ...state, loading: true })),
    on(addOrderSuccess, (state, { order }) => ({ ...state, orders: [...state.orders, order], loading: false })),
    on(editOrder, (state) => ({ ...state, loading: true })),
    on(editOrderSuccess, (state, { order }) => ({ ...state, orders: [...state.orders, order], loading: false })),
    on(deleteOrder, (state) => ({ ...state, loading: true })),
    on(deleteOrderSuccess, (state, { id }) => ({ ...state, orders: state.orders.filter(order => order.id !== id), loading: false })),
);

export function reducer(state: OrdersState | undefined, action: any) {
    return ordersReducer(state, action);
}