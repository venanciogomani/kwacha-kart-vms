import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { UserModel } from "src/state";
import { loadAuthSuccess } from "src/state/actions/auth.actions";
import { loadUsersSuccess } from "src/state/actions/user.actions";
import { UserState } from "src/state/reducers/user.reducer";

@Injectable (
    {providedIn: "root"}
)

export class AuthApiService {
    private authUrl = "http://localhost:5000/auth/";
    private apiUrl = "http://localhost:2200/api/";

    private token: string | null = null;
    private inactivityTimer: any;

    getToken(): string | null {
        return this.getAuthToken();
    }

    setToken(token: string | null): void {
        this.token = token;
    }

    private isDataLoaded$ = new BehaviorSubject<boolean>(false);
    private isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
    private userDataSubject: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);  
    userData$: Observable<UserModel | null> = this.userDataSubject.asObservable();

    constructor(
        private store: Store<UserModel>,
        private http: HttpClient
    ) { }

    createInitialUserState() {
        this.getAllUsers().subscribe((users: UserModel[]) => {
            const initialState: UserState = {
                users,
                loading: false
            }

            this.store.dispatch(loadUsersSuccess(initialState.users));
            this.isUserLoggedIn$.next(true);
        });
    }

    async login(username: string, password: string): Promise<void> {
        const headers = { 'content-type': 'application/json' }
        const options = { headers, withCredentials: true };

        this.http.post<UserModel>(this.authUrl + "login", { username, password }, options).subscribe((user: any) => {
            this.userDataSubject.next(user);
            this.store.dispatch(loadAuthSuccess(user.user));
            this.isDataLoaded$.next(true);
            this.setToken(user.token);
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

    isUserLoggedIn(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }

    resetInactivityTimer(): void {
        clearTimeout(this.inactivityTimer);
        this.inactivityTimer = setTimeout(() => this.logout(), 60000);
    }

    getAuthToken(): string | null {
        const token = sessionStorage.getItem('token');

        if (token) {
            return token;
        }

        return null;
    }
}