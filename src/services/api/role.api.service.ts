import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable, catchError, throwError } from "rxjs";
import { StoreRoleModel } from "src/state";
import { loadRolesSuccess } from "src/state/actions/roles.actions";
import { Roles, Permissions } from "src/state/dataset";
import { RolesState } from "src/state/reducers/roles.reducer";

@Injectable (
    {providedIn: "root"}
)

export class RoleApiService {
    private apiUrl = 'http://localhost:3000/api/';

    private isDataLoaded$ = new BehaviorSubject<boolean>(false);

    constructor(
        private store: Store<RolesState>,
        private http: HttpClient
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
        const headers = { 'content-type': 'application/json' }

        return await this.http.get<StoreRoleModel[]>(this.apiUrl + 'roles', { headers })
    }

    getRoleById(id: string) {
        const role = Roles.filter(role => role.id === id);

        if (role.length === 0) {
            return null;
        }

        return role[0];
    }

    getAllPermissions(): Observable<StoreRoleModel[]> {
        const headers = { 'content-type': 'application/json' }

        return this.http.get<StoreRoleModel[]>(this.apiUrl + 'permissions', { headers })
    }

    getAllPermissionIdsByRole(roleId: string) {
        const headers = { 'content-type': 'application/json' }

        return this.http.get<StoreRoleModel[]>(this.apiUrl + 'permissions/role/' + roleId, { headers })
    }

    saveRole(role: StoreRoleModel): Observable<StoreRoleModel> {
        const roleIndex = Roles.findIndex(item => item.id === role.id);

        if (roleIndex !== -1) {
            return throwError('Role already exists.');
        }

        const headers = { 'content-type': 'application/json' }

        return this.http
            .post<StoreRoleModel>(this.apiUrl, role, { headers })
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError('Something bad happened; please try again later.');
                })
            )
    }

    updateRole(role: StoreRoleModel): Observable<StoreRoleModel> {
        const roleIndex = Roles.findIndex(item => item.id === role.id);

        if (roleIndex === -1) {
            return throwError('Role does not exist.');
        }

        const headers = { 'content-type': 'application/json' }

        return this.http
            .put<StoreRoleModel>(this.apiUrl, role, { headers })
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError('Something bad happened; please try again later.');
                })
            )
    }

    deleteRole(roleId: string): Observable<StoreRoleModel> {
        const roleIndex = Roles.findIndex(item => item.id === roleId);

        if (roleIndex === -1) {
            return throwError('Role does not exist.');
        }

        const headers = { 'content-type': 'application/json' }

        return this.http
            .delete<StoreRoleModel>(this.apiUrl + roleId, { headers })
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