import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ProductCategories } from "src/state/dataset";
import { ProductCategoryModel } from "src/state";

@Injectable(
    { providedIn: "root" }
)

export class CategoryApiService {
    constructor(
        private store: Store<{}>
    ) { }

    createInitialCategoriesState() {}

    getAllCategories() {
        return ProductCategories;
    }

    getCategoryById(id: string): ProductCategoryModel {
        const category = ProductCategories.filter(category => category.id === id);

        if (category.length === 0) {
            return {} as ProductCategoryModel;
        }

        return category[0];
    }
}