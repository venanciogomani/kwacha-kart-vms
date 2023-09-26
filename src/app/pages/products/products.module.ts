import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewProductComponent } from './view-product/view-product.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { ProductTagsComponent } from './product-tags/product-tags.component';
import { ProductBrandsComponent } from './product-brands/product-brands.component';
import { ProductAttributesComponent } from './product-attributes/product-attributes.component';
import { ProductReviewsComponent } from './product-reviews/product-reviews.component';
import { ProductsComponent } from './products.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from "../../shared/shared.module";



@NgModule({
    declarations: [
        ProductsComponent,
        ViewProductComponent,
        ProductCategoriesComponent,
        ProductTagsComponent,
        ProductBrandsComponent,
        ProductAttributesComponent,
        ProductReviewsComponent
    ],
    exports: [
        ProductsComponent,
        ViewProductComponent,
        ProductCategoriesComponent,
        ProductTagsComponent,
        ProductBrandsComponent,
        ProductAttributesComponent,
        ProductReviewsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatSlideToggleModule,
        SharedModule
    ]
})
export class ProductsModule { }
