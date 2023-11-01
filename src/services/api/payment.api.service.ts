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

    async getAllPaymentMethods(): Promise<Observable<PaymentMethodModel[]>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<PaymentMethodModel[]>();
        }

        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };
        return this.http.get<PaymentMethodModel[]>(this.apiUrl + 'payment-methods', options)
    }

    getAllPaymentMethodTypes(): PaymentAccountTypeModel[] {
        return [];
    }

    getPaymentMethodTypeById(id: string): PaymentAccountTypeModel {
        return {} as PaymentAccountTypeModel;
    }
}