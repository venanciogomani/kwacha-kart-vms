import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { VendorOrderModel } from "src/state";
import { OrdersState } from "src/state/reducers/orders.reducer";
import { loadOrdersSuccess } from "src/state/actions/orders.actions";
import { AuthApiService } from "./auth.api.service";
// import { environment } from "src/environments/environment.prod";
import { environment } from "src/environments/environments";

@Injectable (
    { providedIn: "root" }
)

export class OrderApiService {
    private apiUrl = environment.apiUrl;

    private isDataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private store: Store<OrdersState>,
        private authApiService: AuthApiService
    ) { }

    async createInitialOrdersState() {
        (await this.getAllOrders()).subscribe((allOrders: VendorOrderModel[]) => {
            const initialState: OrdersState = {
                orders: allOrders,
                loading: false
            }

            this.store.dispatch(loadOrdersSuccess(initialState.orders));
            this.isDataLoaded$.next(true);
        });
    }

    async getAllOrders(): Promise<Observable<VendorOrderModel[]>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<VendorOrderModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<VendorOrderModel[]>(this.apiUrl + "orders", options)
    }

    updateOrder(order: VendorOrderModel): Observable<VendorOrderModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<VendorOrderModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.put<VendorOrderModel>(this.apiUrl + "orders", order, options);
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}