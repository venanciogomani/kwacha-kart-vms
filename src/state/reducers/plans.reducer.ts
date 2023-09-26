import { createReducer, on } from "@ngrx/store";
import { 
    loadPlans, 
    loadPlansSuccess, 
    loadSinglePlan,
    loadSinglePlanSuccess,
    addPlan,
    addPlanSuccess,
    editPlan,
    editPlanSuccess,
    deletePlan,
    deletePlanSuccess, 
} from "../actions/plans.actions";
import { StorePlansModel } from "../models";

export interface PlansState {
    plans: StorePlansModel[];
    loading: boolean;
}

export const initialState: PlansState = {
    plans: [],
    loading: false,
};

export const plansReducer = createReducer(
    initialState,
    on(loadPlans, (state) => ({ ...state, loading: true })),
    on(loadPlansSuccess, (state, { plans }) => ({ ...state, plans: plans, loading: false })),
    on(loadSinglePlan, (state) => ({ ...state, loading: true })),
    on(loadSinglePlanSuccess, (state, { plan }) => ({ ...state, plans: [...state.plans, plan], loading: false })),
    on(addPlan, (state) => ({ ...state, loading: true })),
    on(addPlanSuccess, (state, { plan }) => ({ ...state, plans: [...state.plans, plan], loading: false })),
    on(editPlan, (state) => ({ ...state, loading: true })),
    on(editPlanSuccess, (state, { plan }) => ({ ...state, plans: [...state.plans, plan], loading: false })),
    on(deletePlan, (state) => ({ ...state, loading: true })),
    on(deletePlanSuccess, (state, { id }) => ({ ...state, plans: state.plans.filter(plan => plan.id !== id), loading: false })),
);

export function reducer(state: PlansState | undefined, action: any) {
    return plansReducer(state, action);
}