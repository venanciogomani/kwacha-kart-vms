import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { environment } from "src/environments/environments";
import { AuthApiService } from "./auth.api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { VendorPromotionModel } from "src/state";

@Injectable(
    { providedIn: "root" }
)

export class PromotionsApiService {
    private apiUrl = environment.apiUrl;

    constructor(
        private store: Store<any>,
        private http: HttpClient,
        private authApiService: AuthApiService
    ) { }

    getAllPromotions(): Observable<VendorPromotionModel[]> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<VendorPromotionModel[]>();
        }

        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<VendorPromotionModel[]>(`${this.apiUrl}promotions`, options);
    }

    publishPromotion(promotion: VendorPromotionModel): Observable<VendorPromotionModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<VendorPromotionModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.post<VendorPromotionModel>(`${this.apiUrl}promotions`, promotion, options);
    }

    updatePromotion(promotion: VendorPromotionModel): Observable<VendorPromotionModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<VendorPromotionModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.put<VendorPromotionModel>(`${this.apiUrl}promotions/${promotion.id}`, promotion, options);
    }

    deletePromotion(promotionId: string): Observable<any> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<any>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };
        return this.http.delete(`${this.apiUrl}promotions/${promotionId}`, options);
    }
}