import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { loadPlansSuccess } from "src/state/actions/plans.actions";
import { Plans } from "src/state/dataset";
import { PlansState } from "src/state/reducers/plans.reducer";

@Injectable (
    {providedIn: "root"}
)

export class PlanApiService {
    constructor(
        private store: Store<PlansState>
    ) { }

    createInitialPlansState() {
        const initialState: PlansState = {
            plans: Plans,
            loading: false
        }
        
        this.store.dispatch(loadPlansSuccess(initialState.plans));
    }

    getPlanById(id: string) {
        const plan = Plans.filter(plan => plan.id === id);

        if (plan.length === 0) {
            return null;
        }

        return plan[0];
    }
}