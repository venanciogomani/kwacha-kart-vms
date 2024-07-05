import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthApiService } from "./auth.api.service";
import { PaymentAccountTypeModel, PaymentMethodModel } from "src/state/models";

@Injectable(
    { providedIn: "root" }
)

export class PaymentApiService {
    private apiUrl = 'http://localhost:2200/api/';

    constructor(
        private store: Store<any>,
        private http: HttpClient,
        private authApiService: AuthApiService
    ) { }

    getAllPaymentMethods(): Observable<PaymentMethodModel[]> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<PaymentMethodModel[]>();
        }

        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };
        return this.http.get<PaymentMethodModel[]>(this.apiUrl + 'payment-methods', options)
    }

    getAllPaymentMethodTypes(): Observable<PaymentAccountTypeModel[]> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<PaymentAccountTypeModel[]>();
        }

        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };
        return this.http.get<PaymentAccountTypeModel[]>(this.apiUrl + 'payment-methods/acount-types', options)
    }

    getPaymentMethodTypeById(id: string): PaymentAccountTypeModel {
        return {} as PaymentAccountTypeModel;
    }

    savePaymentMethod(paymentMethod: PaymentMethodModel): Observable<PaymentMethodModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<PaymentMethodModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.post<PaymentMethodModel>(`${this.apiUrl}payment-methods`, paymentMethod, options);
    }
}