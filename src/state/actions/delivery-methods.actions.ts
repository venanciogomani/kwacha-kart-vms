import { createAction } from "@ngrx/store";
import { DeliveryMethodModel } from "../models";

export enum DeliveryMethodActionTypes {
    LOAD_DELIVERY_METHOD = "[DeliveryMethod] Load Delivery Method",
    LOAD_DELIVERY_METHOD_SUCCESS = "[DeliveryMethod] Load Delivery Method Success",
    LOAD_DELIVERY_METHOD_FAILURE = "[DeliveryMethod] Load Delivery Method Failure",
    CREATE_DELIVERY_METHOD = "[DeliveryMethod] Create Delivery Method",
    CREATE_DELIVERY_METHOD_SUCCESS = "[DeliveryMethod] Create Delivery Method Success",
    CREATE_DELIVERY_METHOD_FAILURE = "[DeliveryMethod] Create Delivery Method Failure",
    UPDATE_DELIVERY_METHOD = "[DeliveryMethod] Update Delivery Method",
    UPDATE_DELIVERY_METHOD_SUCCESS = "[DeliveryMethod] Update Delivery Method Success",
    UPDATE_DELIVERY_METHOD_FAILURE = "[DeliveryMethod] Update Delivery Method Failure",
    DELETE_DELIVERY_METHOD = "[DeliveryMethod] Delete Delivery Method",
    DELETE_DELIVERY_METHOD_SUCCESS = "[DeliveryMethod] Delete Delivery Method Success",
    DELETE_DELIVERY_METHOD_FAILURE = "[DeliveryMethod] Delete Delivery Method Failure"
}

export const loadDeliveryMethod = createAction(
    DeliveryMethodActionTypes.LOAD_DELIVERY_METHOD
);

export const loadDeliveryMethodSuccess = createAction(
    DeliveryMethodActionTypes.LOAD_DELIVERY_METHOD_SUCCESS,
    ({ deliveryMethods }: { deliveryMethods: DeliveryMethodModel[] }) => ({ deliveryMethods })
);

export const loadDeliveryMethodFailure = createAction(
    DeliveryMethodActionTypes.LOAD_DELIVERY_METHOD_FAILURE,
    ({ error }: { error: any }) => ({ error })
);

export const createDeliveryMethod = createAction(
    DeliveryMethodActionTypes.CREATE_DELIVERY_METHOD,
    ({ deliveryMethod }: { deliveryMethod: DeliveryMethodModel }) => ({ deliveryMethod })
);

export const createDeliveryMethodSuccess = createAction(
    DeliveryMethodActionTypes.CREATE_DELIVERY_METHOD_SUCCESS,
    ({ deliveryMethod }: { deliveryMethod: DeliveryMethodModel }) => ({ deliveryMethod })
);

export const createDeliveryMethodFailure = createAction(
    DeliveryMethodActionTypes.CREATE_DELIVERY_METHOD_FAILURE,
    ({ error }: { error: any }) => ({ error })
);

export const updateDeliveryMethod = createAction(
    DeliveryMethodActionTypes.UPDATE_DELIVERY_METHOD,
    ({ deliveryMethod }: { deliveryMethod: DeliveryMethodModel }) => ({ deliveryMethod })
);

export const updateDeliveryMethodSuccess = createAction(
    DeliveryMethodActionTypes.UPDATE_DELIVERY_METHOD_SUCCESS,
    ({ deliveryMethod }: { deliveryMethod: DeliveryMethodModel }) => ({ deliveryMethod })
);

export const updateDeliveryMethodFailure = createAction(
    DeliveryMethodActionTypes.UPDATE_DELIVERY_METHOD_FAILURE,
    ({ error }: { error: any }) => ({ error })
);

export const deleteDeliveryMethod = createAction(
    DeliveryMethodActionTypes.DELETE_DELIVERY_METHOD,
    ({ deliveryMethodId }: { deliveryMethodId: string }) => ({ deliveryMethodId })
);

export const deleteDeliveryMethodSuccess = createAction(
    DeliveryMethodActionTypes.DELETE_DELIVERY_METHOD_SUCCESS,
    ({ deliveryMethodId }: { deliveryMethodId: string }) => ({ deliveryMethodId })
);

export const deleteDeliveryMethodFailure = createAction(
    DeliveryMethodActionTypes.DELETE_DELIVERY_METHOD_FAILURE,
    ({ error }: { error: any }) => ({ error })
);