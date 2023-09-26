import { createAction } from "@ngrx/store";
import { VendorOrderModel } from "../models";

export enum OrdersActionTypes {
    LoadOrders = '[Orders] Load Orders',
    LoadOrdersSuccess = '[Orders] Load Orders Success',
    LoadSingleOrder = '[Orders] Load Single Order',
    LoadSingleOrderSuccess = '[Orders] Load Single Order Success',
    AddOrder = '[Orders] Add Order',
    AddOrderSuccess = '[Orders] Add Order Success',
    EditOrder = '[Orders] Edit Order',
    EditOrderSuccess = '[Orders] Edit Order Success',
    DeleteOrder = '[Orders] Delete Order',
    DeleteOrderSuccess = '[Orders] Delete Order Success',
}

export const loadOrders = createAction(
    OrdersActionTypes.LoadOrders
);

export const loadSingleOrder = createAction(
    OrdersActionTypes.LoadSingleOrder,
    (id: string) => ({ id }),
);

export const loadOrdersSuccess = createAction(
    OrdersActionTypes.LoadOrdersSuccess,
    (orders: VendorOrderModel[]) => ({ orders }),
);

export const loadSingleOrderSuccess = createAction(
    OrdersActionTypes.LoadSingleOrderSuccess,
    (order: VendorOrderModel) => ({ order }),
);

export const addOrder = createAction(
    OrdersActionTypes.AddOrder,
    (order: VendorOrderModel) => ({ order }),
);

export const addOrderSuccess = createAction(
    OrdersActionTypes.AddOrderSuccess,
    (order: VendorOrderModel) => ({ order }),
);

export const editOrder = createAction(
    OrdersActionTypes.EditOrder,
    (order: VendorOrderModel) => ({ order }),
);

export const editOrderSuccess = createAction(
    OrdersActionTypes.EditOrderSuccess,
    (order: VendorOrderModel) => ({ order }),
);

export const deleteOrder = createAction(
    OrdersActionTypes.DeleteOrder,
    (id: string) => ({ id }),
);

export const deleteOrderSuccess = createAction(
    OrdersActionTypes.DeleteOrderSuccess,
    (id: string) => ({ id }),
);