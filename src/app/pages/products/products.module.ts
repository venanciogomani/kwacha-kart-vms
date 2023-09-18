import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product/add-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { ProductTagsComponent } from './product-tags/product-tags.component';
import { ProductBrandsComponent } from './product-brands/product-brands.component';
import { ProductAttributesComponent } from './product-attributes/product-attributes.component';
import { ProductReviewsComponent } from './product-reviews/product-reviews.component';
import { ProductsComponent } from './products.component';



@NgModule({
  declarations: [
    ProductsComponent,
    AddProductComponent,
    UpdateProductComponent,
    ViewProductComponent,
    ProductCategoriesComponent,
    ProductTagsComponent,
    ProductBrandsComponent,
    ProductAttributesComponent,
    ProductReviewsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProductsComponent,
    AddProductComponent,
    UpdateProductComponent,
    ViewProductComponent,
    ProductCategoriesComponent,
    ProductTagsComponent,
    ProductBrandsComponent,
    ProductAttributesComponent,
    ProductReviewsComponent
  ]
})
export class ProductsModule { }
