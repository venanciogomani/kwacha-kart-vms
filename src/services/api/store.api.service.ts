import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { PaymentAccountTypeModel, PaymentMethodModel, StorePaymentDetailsModel, StoresModel } from "src/state";
import { loadStoresSuccess } from "src/state/actions/stores.actions";
import { Stores, StorePaymentDetails, PaymentMethods, PaymentAccountTypes } from "src/state/dataset";
import { StoresState } from "src/state/reducers/stores.reducer";

@Injectable(
    { providedIn: "root" }
)

export class StoreApiService {
    private apiUrl = 'http://localhost:2200/api/';

    private isDataLoaded$ = new BehaviorSubject<boolean>(false);

    constructor(
        private store: Store<StoresState>,
        private http: HttpClient
    ) { }

    async createInitialStoresState() {
        (await this.getAllStores()).subscribe((allStores: StoresModel[]) => {
            const initialState: StoresState = {
                stores: allStores,
                loading: false
            }
            
            this.store.dispatch(loadStoresSuccess(initialState.stores));
            this.isDataLoaded$.next(true);
        });
    }

    async getAllStores(): Promise<Observable<StoresModel[]>> {
        const headers = { 'content-type': 'application/json' }

        return this.http.get<StoresModel[]>(this.apiUrl + 'stores', { headers })
    }

    getStoreById(id: string): StoresModel {
        return Stores.find(store => store.id === id) || {} as StoresModel;
    }

    getStoreByVendorId(vendorId: string): StoresModel[] {
        return Stores.filter(store => store.vendorId === vendorId);
    }

    getStoreByPlanId(planId: string): StoresModel[] {
        return Stores.filter(store => store.planId === planId);
    }

    // TODO: Remove this method
    getStores(): StoresModel[] {
        return Stores;
    }

    saveStore(store: StoresModel): Observable<StoresModel> {
        const headers = { 'content-type': 'application/json' }

        return this.http.post<StoresModel>(this.apiUrl + 'stores', store, { headers })
    }

    getPaymentMethodById(id: string): PaymentMethodModel {
        return PaymentMethods.find(paymentMethod => paymentMethod.id === id && paymentMethod.status === true) || {} as PaymentMethodModel;
    }

    getStorePaymentDetailsByStoreId(storeId: string): StorePaymentDetailsModel[] {
        return StorePaymentDetails.filter(storePaymentDetail => storePaymentDetail.storeId === storeId);
    }

    getStorePrimaryPaymentDetailsByStoreId(storeId: string): StorePaymentDetailsModel {
        return StorePaymentDetails.find(storePaymentDetail => storePaymentDetail.storeId === storeId && storePaymentDetail.isPrimary === true) || {} as StorePaymentDetailsModel;
    }

    getAllPaymentMethods(): PaymentMethodModel[] {
        return PaymentMethods.filter(paymentMethod => paymentMethod.status === true);
    }

    getAllPaymentMethodTypes(): PaymentAccountTypeModel[] {
        return PaymentAccountTypes.filter(paymentAccountType => paymentAccountType.status === true);
    }

    getPaymentMethodTypeById(id: string): PaymentAccountTypeModel {
        return PaymentAccountTypes.find(paymentAccountType => paymentAccountType.id === id && paymentAccountType.status === true) || {} as PaymentAccountTypeModel;
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}