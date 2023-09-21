import { createReducer, on } from "@ngrx/store";
import { loadPlans, loadSinglePlan, loadPlansSuccess } from "../actions/plans.actions";
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
    on(loadSinglePlan, (state) => ({ ...state, loading: true })),
    on(loadPlansSuccess, (state, { plans }) => ({ ...state, plans: plans, loading: false })),
);

export function reducer(state: PlansState | undefined, action: any) {
    return plansReducer(state, action);
}