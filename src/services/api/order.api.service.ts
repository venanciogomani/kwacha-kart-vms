import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { VendorOrderModel } from "src/state";
import { OrdersState } from "src/state/reducers/orders.reducer";
import { loadOrdersSuccess } from "src/state/actions/orders.actions";
import { AuthApiService } from "./auth.api.service";

@Injectable (
    { providedIn: "root" }
)

export class OrderApiService {
    private apiUrl = "http://localhost:2200/api/";

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

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}