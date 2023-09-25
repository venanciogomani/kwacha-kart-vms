import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { UserModel } from "src/state";

@Injectable (
    {providedIn: "root"}
)

export class AuthApiService {
    private apiUrl = "http://localhost:5000/auth/";

    constructor(
        private store: Store<UserModel>,
        private http: HttpClient
    ) { }

    async login(username: string, password: string): Promise<Observable<UserModel>> {
        const headers = { 'content-type': 'application/json' }

        return this.http.post<UserModel>(this.apiUrl + "login", { username, password }, { headers });
    }
}