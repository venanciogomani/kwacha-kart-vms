import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { PaymentAccountTypeModel, PaymentMethodModel, StorePaymentDetailsModel, StoresModel } from "src/state";
import { loadStoresSuccess } from "src/state/actions/stores.actions";
import { Stores, StorePaymentDetails, PaymentMethods, PaymentAccountTypes } from "src/state/dataset";
import { StoresState } from "src/state/reducers/stores.reducer";
import { AuthApiService } from "./auth.api.service";

@Injectable(
    { providedIn: "root" }
)

export class StoreApiService {
    private apiUrl = 'http://localhost:2200/api/';

    private isDataLoaded$ = new BehaviorSubject<boolean>(false);

    constructor(
        private store: Store<StoresState>,
        private http: HttpClient,
        private authApiService: AuthApiService
    ) { }

    async createInitialStoresState(userId: string) {
        (await this.getAllStoresByVendorId(userId)).subscribe((allStores: StoresModel[]) => {
            const initialState: StoresState = {
                stores: allStores,
                loading: false
            }
            
            this.store.dispatch(loadStoresSuccess(initialState.stores));
            this.isDataLoaded$.next(true);
        });
    }

    async getAllStores(): Promise<Observable<StoresModel[]>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StoresModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<StoresModel[]>(this.apiUrl + 'stores', options)
    }

    async getAllStoresByVendorId(vendorId: string): Promise<Observable<StoresModel[]>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StoresModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<StoresModel[]>(this.apiUrl + 'stores/vendor/' + vendorId, options)
    }

    async getStoreById(id: string): Promise<Observable<StoresModel>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StoresModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<StoresModel>(this.apiUrl + 'stores/' + id, options)
    }

    getStoreByVendorId(vendorId: string): StoresModel[] {
        return Stores.filter(store => store.vendorId === vendorId);
    }

    getStoreByPlanId(planId: string): StoresModel[] {
        return Stores.filter(store => store.planId === planId);
    }

    saveStore(store: StoresModel): Observable<StoresModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StoresModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.post<StoresModel>(this.apiUrl + 'stores', store, options)
    }

    updateStore(store: StoresModel): Observable<StoresModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StoresModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.put<StoresModel>(this.apiUrl + 'stores/' + store.id, store, options)
    }

    deleteStore(storeId: string): Observable<StoresModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StoresModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.delete<StoresModel>(this.apiUrl + 'stores/' + storeId, options)
    }

    getPaymentMethodById(id: string): PaymentMethodModel {
        return PaymentMethods.find(paymentMethod => paymentMethod.id === id && paymentMethod.status === true) || {} as PaymentMethodModel;
    }

    async getStorePaymentDetailsByStoreId(storeId: string): Promise<Observable<StorePaymentDetailsModel[]>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StorePaymentDetailsModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };
        return this.http.get<StorePaymentDetailsModel[]>(this.apiUrl + 'payment-methods/store/payment-details/' + storeId, options)
    }

    getStorePrimaryPaymentDetailsByStoreId(storeId: string): StorePaymentDetailsModel {
        return StorePaymentDetails.find(storePaymentDetail => storePaymentDetail.storeId === storeId && storePaymentDetail.isPrimary === true) || {} as StorePaymentDetailsModel;
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}