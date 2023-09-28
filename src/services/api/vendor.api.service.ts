import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { VendorModel } from "src/state";
import { loadVendorsSuccess } from "src/state/actions/vendors.actions";
import { Vendors } from "src/state/dataset";
import { VendorsState } from "src/state/reducers/vendors.reducer";

@Injectable (
    {providedIn: "root"}
)

export class VendorApiService {
    private apiUrl = "http://localhost:2200/api/";
    
    private isDataLoaded$ = new BehaviorSubject<boolean>(false);

    constructor(
        private store: Store<VendorsState>,
        private http: HttpClient
    ) { }

    async createInitialVendorsState() {
        (await this.getAllVendors()).subscribe((allVendors: VendorModel[]) => {
            const initialState: VendorsState = {
                vendors: allVendors,
                loading: false
            }

            this.store.dispatch(loadVendorsSuccess(initialState.vendors));
            this.isDataLoaded$.next(true);
        });
    }

    async getAllVendors(): Promise<Observable<VendorModel[]>> {
        const headers = { 'content-type': 'application/json' }

        return (this.http.get<VendorModel[]>(this.apiUrl + "vendors", { headers }));
    }

    async getVendorById(id: string): Promise<Observable<VendorModel>> {
        const headers = { 'content-type': 'application/json' }

        return this.http.get<VendorModel>(this.apiUrl + "vendors/" + id, { headers });
    }

    getVendorsByRoleId(roleId: string): VendorModel[] {
        return [] as VendorModel[];
    }

    getVendorsByStoreId(storeId: string): VendorModel[] {
        return [] as VendorModel[];
    }

    saveVendor(vendor: VendorModel): Observable<VendorModel> {
        const headers = { 'content-type': 'application/json' }

        return this.http.post<VendorModel>(this.apiUrl + "vendors", vendor, { headers });
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}