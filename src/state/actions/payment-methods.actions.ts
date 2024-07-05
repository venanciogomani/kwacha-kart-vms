import { createAction } from "@ngrx/store";
import { PaymentMethodModel } from "../models";

export enum PaymentMethodActionTypes {
    LOAD_PAYMENT_METHOD = "[PaymentMethod] Load Payment Method",
    LOAD_PAYMENT_METHOD_SUCCESS = "[PaymentMethod] Load Payment Method Success",
    LOAD_PAYMENT_METHOD_FAILURE = "[PaymentMethod] Load Payment Method Failure",
    CREATE_PAYMENT_METHOD = "[PaymentMethod] Create Payment Method",
    CREATE_PAYMENT_METHOD_SUCCESS = "[PaymentMethod] Create Payment Method Success",
    CREATE_PAYMENT_METHOD_FAILURE = "[PaymentMethod] Create Payment Method Failure",
    UPDATE_PAYMENT_METHOD = "[PaymentMethod] Update Payment Method",
    UPDATE_PAYMENT_METHOD_SUCCESS = "[PaymentMethod] Update Payment Method Success",
    UPDATE_PAYMENT_METHOD_FAILURE = "[PaymentMethod] Update Payment Method Failure",
    DELETE_PAYMENT_METHOD = "[PaymentMethod] Delete Payment Method",
    DELETE_PAYMENT_METHOD_SUCCESS = "[PaymentMethod] Delete Payment Method Success",
    DELETE_PAYMENT_METHOD_FAILURE = "[PaymentMethod] Delete Payment Method Failure"
}

export const loadPaymentMethod = createAction(
    PaymentMethodActionTypes.LOAD_PAYMENT_METHOD
);

export const loadPaymentMethodSuccess = createAction(
    PaymentMethodActionTypes.LOAD_PAYMENT_METHOD_SUCCESS,
    ({ paymentMethods }: { paymentMethods: PaymentMethodModel[] }) => ({ paymentMethods })
);

export const loadPaymentMethodFailure = createAction(
    PaymentMethodActionTypes.LOAD_PAYMENT_METHOD_FAILURE,
    ({ error }: { error: any }) => ({ error })
);

export const createPaymentMethod = createAction(
    PaymentMethodActionTypes.CREATE_PAYMENT_METHOD,
    ({ paymentMethod }: { paymentMethod: PaymentMethodModel }) => ({ paymentMethod })
);

export const createPaymentMethodSuccess = createAction(
    PaymentMethodActionTypes.CREATE_PAYMENT_METHOD_SUCCESS,
    ({ paymentMethod }: { paymentMethod: PaymentMethodModel }) => ({ paymentMethod })
);

export const createPaymentMethodFailure = createAction(
    PaymentMethodActionTypes.CREATE_PAYMENT_METHOD_FAILURE,
    ({ error }: { error: any }) => ({ error })
);

export const updatePaymentMethod = createAction(
    PaymentMethodActionTypes.UPDATE_PAYMENT_METHOD,
    ({ paymentMethod }: { paymentMethod: PaymentMethodModel }) => ({ paymentMethod })
);

export const updatePaymentMethodSuccess = createAction(
    PaymentMethodActionTypes.UPDATE_PAYMENT_METHOD_SUCCESS,
    ({ paymentMethod }: { paymentMethod: PaymentMethodModel }) => ({ paymentMethod })
);

export const updatePaymentMethodFailure = createAction(
    PaymentMethodActionTypes.UPDATE_PAYMENT_METHOD_FAILURE,
    ({ error }: { error: any }) => ({ error })
);

export const deletePaymentMethod = createAction(
    PaymentMethodActionTypes.DELETE_PAYMENT_METHOD,
    ({ paymentMethodId }: { paymentMethodId: string }) => ({ paymentMethodId })
);

export const deletePaymentMethodSuccess = createAction(
    PaymentMethodActionTypes.DELETE_PAYMENT_METHOD_SUCCESS,
    ({ paymentMethodId }: { paymentMethodId: string }) => ({ paymentMethodId })
);

export const deletePaymentMethodFailure = createAction(
    PaymentMethodActionTypes.DELETE_PAYMENT_METHOD_FAILURE,
    ({ error }: { error: any }) => ({ error })
);