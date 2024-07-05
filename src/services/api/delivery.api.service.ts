import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AuthApiService } from "./auth.api.service";
import { DeliveryMethodModel } from "src/state/models";

@Injectable(
    { providedIn: "root" }
)

export class DeliveryApiService {
    private apiUrl = 'http://localhost:2200/api/';

    constructor(
        private store: Store<any>,
        private http: HttpClient,
        private authApiService: AuthApiService
    ) { }

    getAllDeliveryMethods(): Observable<DeliveryMethodModel[]> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<DeliveryMethodModel[]>();
        }

        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };
        return this.http.get<DeliveryMethodModel[]>(this.apiUrl + 'delivery-methods', options)
    }

    saveDeliveryMethod(deliveryMethod: DeliveryMethodModel): Observable<DeliveryMethodModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<DeliveryMethodModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.post<DeliveryMethodModel>(`${this.apiUrl}delivery-methods`, deliveryMethod, options);
    }

    deleteDeliveryMethod(id: string): Observable<void> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<void>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.delete<void>(`${this.apiUrl}delivery-methods/${id}`, options);
    }
}