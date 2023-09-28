import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { UserModel } from "src/state";
import { loadUserSuccess } from "src/state/actions/user.actions";

@Injectable (
    {providedIn: "root"}
)

export class AuthApiService {
    private authUrl = "http://localhost:5000/auth/";
    private apiUrl = "http://localhost:2200/api/";

    private isDataLoaded$ = new BehaviorSubject<boolean>(false);
    private userDataSubject: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);  
    userData$: Observable<UserModel | null> = this.userDataSubject.asObservable();

    constructor(
        private store: Store<UserModel>,
        private http: HttpClient
    ) { }

    async login(username: string, password: string): Promise<void> {
        const headers = { 'content-type': 'application/json' }

        this.http.post<UserModel>(this.authUrl + "login", { username, password }, { headers }).subscribe((user: UserModel) => {
            this.userDataSubject.next(user);
            this.store.dispatch(loadUserSuccess(user));
            this.isDataLoaded$.next(true);
        },
            (error) => {
                console.log(error);
            }
        );
    }

    getAllUsersByIds(ids: string[]): Observable<UserModel[]> {
        const headers = { 'content-type': 'application/json' }

        return this.http.post<UserModel[]>(this.apiUrl + "users/usersByIds", { ids }, { headers });
    }

    getAllUsers(): Observable<UserModel[]> {
        const headers = { 'content-type': 'application/json' }

        return this.http.get<UserModel[]>(this.apiUrl + "users/all", { headers })
    }

    isUserLoggedIn(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}