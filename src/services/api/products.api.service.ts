import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ProductModel } from "src/state";
import { loadProductsSuccess } from "src/state/actions/products.actions";
import { ProductsState } from "src/state/reducers/products.reducer";
import { ProductItems } from "src/state/dataset";

@Injectable(
    { providedIn: "root" }
)

export class ProductApiService {
    constructor(
        private store: Store<ProductsState>
    ) { }

    createInitialProductsState() {
        const initialState: ProductsState = {
            products: ProductItems,
            loading: false
        }
        
        this.store.dispatch(loadProductsSuccess(initialState.products));
    }

    getAllProducts() {
        return ProductItems;
    }

    getProductById(id: string): ProductModel {
        return ProductItems.find(product => product.id === id) || {} as ProductModel;
    }

    getProductsByVendorId(vendorId: string): ProductModel[] {
        return ProductItems.filter(product => product.vendorId === vendorId);
    }
}