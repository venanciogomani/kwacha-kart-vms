import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StoreTeamComponent } from './store-team/store-team.component';
import { StoreRolesComponent } from './store-roles/store-roles.component';
import { StorePlansComponent } from './store-plans/store-plans.component';
import { ViewStoreComponent } from './view-store/view-store.component';
import { StoresComponent } from './stores.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ToasterComponent } from 'src/app/shared/toaster/toaster.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { StorePaymentMethodsComponent } from './store-payment-methods/store-payment-methods.component';
import { StoreDeliveryMethodsComponent } from './store-delivery-methods/store-delivery-methods.component';



@NgModule({
  declarations: [
    StoresComponent,
    StoreTeamComponent,
    StoreRolesComponent,
    StorePlansComponent,
    ViewStoreComponent,
    StorePaymentMethodsComponent,
    StoreDeliveryMethodsComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatSlideToggleModule,
    SharedModule
  ],
  exports: [
    StoresComponent,
    StoreTeamComponent,
    StoreRolesComponent,
    StorePlansComponent,
    ViewStoreComponent,
    StoreDeliveryMethodsComponent,
    StorePaymentMethodsComponent,
  ]
})
export class StoresModule { }
