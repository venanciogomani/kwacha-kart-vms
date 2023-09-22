import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ProductBrands } from "src/state/dataset";
import { ProductBrandModel } from "src/state";

@Injectable(
    { providedIn: "root" }
)

export class BrandApiService {
    constructor(
        private store: Store<{}>
    ) { }

    createInitialBrandsState() {}

    getAllBrands() {
        return ProductBrands;
    }

    getBrandById(id: string): ProductBrandModel {
        const brand = ProductBrands.filter(brand => brand.id === id);

        if (brand.length === 0) {
            return {} as ProductBrandModel;
        }

        return brand[0];
    }
}