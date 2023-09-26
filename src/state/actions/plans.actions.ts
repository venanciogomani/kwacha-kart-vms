import { createAction } from "@ngrx/store";
import { StorePlansModel } from "../models";

export enum PlansActionTypes {
    LoadPlans = '[Plans] Load Plans',
    LoadPlansSuccess = '[Plans] Load Plans Success',
    LoadSinglePlan = '[Plans] Load Single Plan',
    LoadSinglePlanSuccess = '[Plans] Load Single Plan Success',
    AddPlan = '[Plans] Add Plan',
    AddPlanSuccess = '[Plans] Add Plan Success',
    EditPlan = '[Plans] Edit Plan',
    EditPlanSuccess = '[Plans] Edit Plan Success',
    DeletePlan = '[Plans] Delete Plan',
    DeletePlanSuccess = '[Plans] Delete Plan Success',
}

export const loadPlans = createAction(
    PlansActionTypes.LoadPlans
);

export const loadPlansSuccess = createAction(
    PlansActionTypes.LoadPlansSuccess,
    (plans: StorePlansModel[]) => ({ plans }),
);

export const loadSinglePlan = createAction(
    PlansActionTypes.LoadSinglePlan,
    (id: string) => ({ id }),
);

export const loadSinglePlanSuccess = createAction(
    PlansActionTypes.LoadSinglePlanSuccess,
    (plan: StorePlansModel) => ({ plan }),
);

export const addPlan = createAction(
    PlansActionTypes.AddPlan,
    (plan: StorePlansModel) => ({ plan }),
);

export const addPlanSuccess = createAction(
    PlansActionTypes.AddPlanSuccess,
    (plan: StorePlansModel) => ({ plan }),
);

export const editPlan = createAction(
    PlansActionTypes.EditPlan,
    (plan: StorePlansModel) => ({ plan }),
);

export const editPlanSuccess = createAction(
    PlansActionTypes.EditPlanSuccess,
    (plan: StorePlansModel) => ({ plan }),
);

export const deletePlan = createAction(
    PlansActionTypes.DeletePlan,
    (id: string) => ({ id }),
);

export const deletePlanSuccess = createAction(
    PlansActionTypes.DeletePlanSuccess,
    (id: string) => ({ id }),
);