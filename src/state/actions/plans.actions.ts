import { createAction } from "@ngrx/store";
import { StorePlansModel } from "../models";

export enum PlansActionTypes {
    LoadPlans = '[Plans] Load Plans',
    LoadSinglePlan = '[Plans] Load Single Plan',
    LoadPlansSuccess = '[Plans] Load Plans Success',
}

export const loadPlans = createAction(
    PlansActionTypes.LoadPlans
);

export const loadSinglePlan = createAction(
    PlansActionTypes.LoadSinglePlan,
    (id: string) => ({ id }),
);

export const loadPlansSuccess = createAction(
    PlansActionTypes.LoadPlansSuccess,
    (plans: StorePlansModel[]) => ({ plans }),
);