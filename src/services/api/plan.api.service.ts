import { Injectable } from "@angular/core";
import { Plans } from "src/state/dataset";

@Injectable (
    {providedIn: "root"}
)

export class PlanApiService {
    constructor() { }
    getPlanById(id: string) {
        const plan = Plans.filter(plan => plan.id === id);

        if (plan.length === 0) {
            return null;
        }

        return plan[0];
    }
}