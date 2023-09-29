import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable, catchError, throwError } from "rxjs";
import { StorePlansModel, StoreRoleModel } from "src/state";
import { loadPlansSuccess } from "src/state/actions/plans.actions";
import { Plans } from "src/state/dataset";
import { PlansState } from "src/state/reducers/plans.reducer";
import { AuthApiService } from "./auth.api.service";

@Injectable (
    {providedIn: "root"}
)

export class PlanApiService {
    private apiUrl = 'http://localhost:2200/api/';

    private isDataLoaded$ = new BehaviorSubject<boolean>(false);
    
    constructor(
        private store: Store<PlansState>,
        private http: HttpClient,
        private authApiService: AuthApiService
    ) { }

    async createInitialPlansState() {
        this.getAllPlans().subscribe((allPlans: StorePlansModel[]) => {
            const initialState: PlansState = {
                plans: allPlans,
                loading: false
            }
            
            this.store.dispatch(loadPlansSuccess(initialState.plans));
            this.isDataLoaded$.next(true);
        });
    }

    getAllPlans(): Observable<StorePlansModel[]> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StorePlansModel[]>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };
        
        return this.http.get<StorePlansModel[]>(this.apiUrl + 'plans', options)
    }

    getPlanById(id: string) {
        const plan = Plans.filter(plan => plan.id === id);

        if (plan.length === 0) {
            return null;
        }

        return plan[0];
    }

    savePlan(plan: StorePlansModel): Observable<StorePlansModel> {
        const authToken = this.authApiService.getAuthToken();
        if (!authToken) {
            return new Observable<StorePlansModel>();
        }
        const headers = new HttpHeaders({ 'content-type': 'application/json' }).set('Authorization', `Bearer ${authToken}`);
        const options = { headers, withCredentials: true };
        
        return this.http
            .post<StorePlansModel>(this.apiUrl + 'plans', plan, options)
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