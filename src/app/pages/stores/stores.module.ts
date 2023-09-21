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



@NgModule({
  declarations: [
    StoresComponent,
    StoreTeamComponent,
    StoreRolesComponent,
    StorePlansComponent,
    ViewStoreComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatSlideToggleModule
  ],
  exports: [
    StoresComponent,
    StoreTeamComponent,
    StoreRolesComponent,
    StorePlansComponent,
    ViewStoreComponent,
  ]
})
export class StoresModule { }
