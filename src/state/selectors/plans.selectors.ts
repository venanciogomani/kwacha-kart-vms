import { createSelector, createFeatureSelector } from "@ngrx/store";
import { PlansState } from "../reducers/plans.reducer";

export const selectPlansState = createFeatureSelector<PlansState>("plans");

export const selectPlans = createSelector(
    selectPlansState,
    (state: PlansState) => state.plans
);

export const selectPlanById = (id: string) => createSelector(
    selectPlansState,
    (state: PlansState) => state.plans.find(plan => plan.id === id)
);

export const selectLoading = createSelector(
    selectPlansState,
    (state: PlansState) => state.loading
);