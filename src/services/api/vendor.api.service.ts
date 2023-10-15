import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { VendorModel } from "src/state";
import { deleteVendor, loadVendorsSuccess } from "src/state/actions/vendors.actions";
import { Vendors } from "src/state/dataset";
import { VendorsState } from "src/state/reducers/vendors.reducer";
import { AuthApiService } from "./auth.api.service";

@Injectable (
    {providedIn: "root"}
)

export class VendorApiService {
    private apiUrl = "http://localhost:2200/api/";
    
    private isDataLoaded$ = new BehaviorSubject<boolean>(false);

    constructor(
        private store: Store<VendorsState>,
        private http: HttpClient,
        private authApiService: AuthApiService
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
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<VendorModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return (this.http.get<VendorModel[]>(this.apiUrl + "vendors", options));
    }

    async getVendorById(id: string): Promise<Observable<VendorModel>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<VendorModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<VendorModel>(this.apiUrl + "vendors/" + id, options);
    }

    async getVendorByUserId(userId: string): Promise<Observable<VendorModel>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<VendorModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<VendorModel>(this.apiUrl + "vendors/user/" + userId, options);
    }

    getVendorsByRoleId(roleId: string): VendorModel[] {
        return [] as VendorModel[];
    }

    getVendorsByStoreId(storeId: string): VendorModel[] {
        return [] as VendorModel[];
    }

    saveVendor(vendor: VendorModel): Observable<VendorModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<VendorModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.post<VendorModel>(this.apiUrl + "vendors", vendor, options);
    }

    updateVendor(vendor: VendorModel): Observable<VendorModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<VendorModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.put<VendorModel>(this.apiUrl + "vendors/" + vendor.id, vendor, options);
    }

    deleteVendor(id: string): Observable<string> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<string>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.delete<string>(this.apiUrl + "vendors/" + id, options);
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}