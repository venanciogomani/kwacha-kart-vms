import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { UserModel } from "src/state";
import { loadAuthSuccess } from "src/state/actions/auth.actions";
import { loadUsersSuccess } from "src/state/actions/user.actions";
import { UserState } from "src/state/reducers/user.reducer";

export type UserRole = {
    [key in 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN' | 'ROLE_VENDOR_ADMIN']: boolean;
}

@Injectable (
    {providedIn: "root"}
)

export class AuthApiService {
    private authUrl = "http://localhost:5000/auth/";
    private apiUrl = "http://localhost:2200/api/";

    private inactivityTimer: any;
    private tokenExpirationTimer: any;

    private isDataLoaded$ = new BehaviorSubject<boolean>(false);
    private isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
    private userDataSubject: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);  
    private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    userData$: Observable<UserModel | null> = this.userDataSubject.asObservable();
    token$: Observable<string | null> = this.tokenSubject.asObservable();

    userRole: UserRole = {
        ROLE_ADMIN: false,
        ROLE_SUPER_ADMIN: true,
        ROLE_VENDOR_ADMIN: false
    }

    constructor(
        private store: Store<UserModel>,
        private http: HttpClient,
        private router: Router
    ) { }

    createInitialUserState() {
        this.getAllUsers().subscribe((users: UserModel[]) => {
            const initialState: UserState = {
                users,
                loading: false
            }

            this.store.dispatch(loadUsersSuccess(initialState.users));
            this.isUserLoggedIn$.next(true);
            this.resetInactivityTimer();
        });
    }

    async login(username: string, password: string): Promise<void> {
        const headers = { 'content-type': 'application/json' }
        const options = { headers, withCredentials: true };

        this.http.post<UserModel>(this.authUrl + "vendor/login", { username, password }, options).subscribe((user: any) => {
            this.userDataSubject.next(user);
            this.store.dispatch(loadAuthSuccess(user.user));
            this.isDataLoaded$.next(true);
            sessionStorage.setItem('token', user.token);
        },
            (error) => {
                console.log(error);
            }
        );
    }

    async logout(): Promise<void> {
        this.userDataSubject.next(null);
        this.isDataLoaded$.next(false);
        this.isUserLoggedIn$.next(false);
        this.clearAuthToken();
        this.router.navigate(['auth/login']);
    }

    getAllUsersByIds(ids: string[]): Observable<UserModel[]> {
        const authToken = this.getAuthToken();
        if (!authToken) {
            return new Observable<UserModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.post<UserModel[]>(this.apiUrl + "users/usersByIds", { ids }, options);
    }

    getAllUsers(): Observable<UserModel[]> {
        const authToken = this.getAuthToken();
        if (!authToken) {
            return new Observable<UserModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.get<UserModel[]>(this.apiUrl + "users/all", options)
    }

    saveUser(user: UserModel): Observable<UserModel> {
        const authToken = this.getAuthToken();
        if (!authToken) {
            return new Observable<UserModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.post<UserModel>(this.apiUrl + "users/save", user, options);
    }

    updateUser(user: UserModel): Observable<UserModel> {
        const authToken = this.getAuthToken();
        if (!authToken) {
            return new Observable<UserModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.put<UserModel>(this.apiUrl + "users/" + user.id, user, options);
    }

    deleteUser(id: string): Observable<void> {
        const authToken = this.getAuthToken();
        if (!authToken) {
            return new Observable<void>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };

        return this.http.delete<void>(this.apiUrl + "users/" + id, options);
    }

    isUserLoggedIn(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }

    resetInactivityTimer(): void {
        clearTimeout(this.inactivityTimer);
        this.inactivityTimer = setTimeout(() => this.logout(), 600000);
        this.reserLogoutTimer();
    }

    setInitialToken(token: string) {
        this.tokenSubject.next(token);
    }

    getAuthToken(): string | null {
        const token = sessionStorage.getItem('token');

        if (token) {
            return token;
        }

        return null;
    }

    clearAuthToken(): void {
        sessionStorage.removeItem('token');
    }

    reserLogoutTimer(): void {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        const token = this.getAuthToken();
        const tokenData = this.decodeToken(token);

        if (tokenData && tokenData.exp) {
            const expirationTime = tokenData.exp * 1000;
            const now = new Date().getTime();
            const expiresIn = expirationTime - now;
            this.tokenExpirationTimer = setTimeout(() => {
                this.refreshToken().subscribe((newToken: any) => {
                    this.tokenSubject.next(newToken);
                }, (error) => {
                    console.log(error);
                });
            }, expiresIn);
        }
    }

    async getCurrentUser(): Promise<Observable<UserModel>> {
        const token = this.getAuthToken();
        
        if (!token) {
            return new Observable<UserModel>();
        }

        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${token}`);
        const options = { headers, withCredentials: true };

        return this.http.get<UserModel>(this.authUrl + "me", options);
    }

    private refreshToken(): Observable<any> {
        const token = this.getAuthToken();
        if (!token) {
            return new Observable<any>();
        }

        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${token}`);
        const options = { headers, withCredentials: true };

        return this.http.get<any>(this.authUrl + "renewToken", options);
    }

    private decodeToken(token: string | null): any {
        if (!token) {
            return null;
        }

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(atob(base64));
    }

    hasRole(role: keyof UserRole): boolean {
        return this.userRole[role];
    }
}