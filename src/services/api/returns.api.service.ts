import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthApiService } from "./auth.api.service";

@Injectable (
    { providedIn: "root" }
)

export class ReturnsApiService {
    private apiUrl = "http://localhost:2200/api/";

    private isDataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private authApiService: AuthApiService
    ) { }

    isDataLoaded(): Observable<boolean> {
        return this.isDataLoaded$.asObservable();
    }
}