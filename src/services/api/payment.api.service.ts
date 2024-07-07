import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AuthApiService } from "./auth.api.service";
import { PaymentAccountTypeModel, PaymentMethodModel } from "src/state/models";
// import { environment } from "src/environments/environment.prod";
import { environment } from "src/environments/environments";

@Injectable(
    { providedIn: "root" }
)

export class PaymentApiService {
    private apiUrl = environment.apiUrl;

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

    deletePaymentMethod(id: string): Observable<void> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<void>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.delete<void>(`${this.apiUrl}payment-methods/${id}`, options);
    }
}