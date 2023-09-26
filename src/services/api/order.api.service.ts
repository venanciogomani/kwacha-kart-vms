import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { VendorOrderModel } from "src/state";
import { OrdersState } from "src/state/reducers/orders.reducer";
import { loadOrdersSuccess } from "src/state/actions/orders.actions";

@Injectable (
    { providedIn: "root" }
)

export class OrderApiService {
    private apiUrl = "http://localhost:2200/api/";

    private isDataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private store: Store<OrdersState>
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
        const headers = { 'content-type': 'application/json' }

        return this.http.get<VendorOrderModel[]>(this.apiUrl + "orders", { headers })
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}