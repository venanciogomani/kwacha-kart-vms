import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from './shared/shared.module';
import { PagesModule } from './pages/pages.module';
import { ErrorsModule } from './errors/errors.module';
import { StoreModule } from '@ngrx/store';
import { storesReducer } from 'src/state/reducers/stores.reducer';
import { plansReducer } from 'src/state/reducers/plans.reducer';
import { rolesReducer } from 'src/state/reducers/roles.reducer';
import { vendorsReducer } from 'src/state/reducers/vendors.reducer';
import { productsReducer } from 'src/state/reducers/products.reducer';
import { AuthModule } from './pages/auth/auth.module';
import { TemplatesModule } from './templates/templates.module';
import { userReducer } from 'src/state/reducers/user.reducer';
import { ordersReducer } from 'src/state/reducers/orders.reducer';
import { categoriesReducer } from 'src/state/reducers/categories.reducer';
import { brandsReducer } from 'src/state/reducers/brands.reducer';
import { tagsReducer } from 'src/state/reducers/tags.reducer';
import { reviewsReducer } from 'src/state/reducers/reviews.reducer';
import { authReducer } from 'src/state/reducers/auth.reducer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    SharedModule,
    PagesModule,
    ErrorsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    TemplatesModule,
    StoreModule.forRoot({
      stores: storesReducer,
      plans: plansReducer,
      roles: rolesReducer,
      vendors: vendorsReducer,
      products: productsReducer,
      user: userReducer,
      auth: authReducer,
      orders: ordersReducer,
      categories: categoriesReducer,
      brands: brandsReducer,
      tags: tagsReducer,
      reviews: reviewsReducer
    }),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
