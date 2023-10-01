import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable, catchError, throwError } from "rxjs";
import { StoreRoleModel } from "src/state";
import { loadRolesSuccess } from "src/state/actions/roles.actions";
import { Roles, Permissions } from "src/state/dataset";
import { RolesState } from "src/state/reducers/roles.reducer";
import { AuthApiService } from "./auth.api.service";

@Injectable (
    {providedIn: "root"}
)

export class RoleApiService {
    private apiUrl = 'http://localhost:2200/api/';

    private isDataLoaded$ = new BehaviorSubject<boolean>(false);

    constructor(
        private store: Store<RolesState>,
        private http: HttpClient,
        private authApiService: AuthApiService
    ) { }

    async createInitialRolesState() {
        (await this.getAllRoles()).subscribe((allRoles: StoreRoleModel[]) => {
            const initialState: RolesState = {
                roles: allRoles,
                loading: false
            }
            
            this.store.dispatch(loadRolesSuccess(initialState.roles));
            this.isDataLoaded$.next(true);
        });

    }

    async getAllRoles(): Promise<Observable<StoreRoleModel[]>> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StoreRoleModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<StoreRoleModel[]>(this.apiUrl + 'roles', options)
    }

    getRoleById(id: string) {
        const role = Roles.filter(role => role.id === id);

        if (role.length === 0) {
            return null;
        }

        return role[0];
    }

    getAllPermissions(): Observable<StoreRoleModel[]> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StoreRoleModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<StoreRoleModel[]>(this.apiUrl + 'permissions', options)
    }

    getAllPermissionIdsByRole(roleId: string) {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StoreRoleModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<StoreRoleModel[]>(this.apiUrl + 'permissions/role/' + roleId, options)
    }

    saveRole(role: StoreRoleModel): Observable<StoreRoleModel> {
        const roleIndex = Roles.findIndex(item => item.id === role.id);

        if (roleIndex !== -1) {
            return throwError('Role already exists.');
        }

        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StoreRoleModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http
            .post<StoreRoleModel>(this.apiUrl + 'roles', role, options)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError('Something bad happened; please try again later.');
                })
            )
    }

    updateRole(role: StoreRoleModel): Observable<StoreRoleModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StoreRoleModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http
            .put<StoreRoleModel>(this.apiUrl + 'roles/' + role.id, role, options)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError('Something bad happened; please try again later.');
                })
            )
    }

    deleteRole(roleId: string): Observable<StoreRoleModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StoreRoleModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };
        console.log('delete role: ', roleId);

        return this.http
            .delete<StoreRoleModel>(this.apiUrl + 'roles/' + roleId, options)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError('Something bad happened; please try again later.');
                })
            )
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}