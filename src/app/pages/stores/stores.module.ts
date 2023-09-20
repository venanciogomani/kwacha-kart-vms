import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddStoreComponent } from './add-store/add-store.component';
import { StoreTeamComponent } from './store-team/store-team.component';
import { StoreRolesComponent } from './store-roles/store-roles.component';
import { StorePlansComponent } from './store-plans/store-plans.component';
import { ViewStoreComponent } from './view-store/view-store.component';
import { UpdateStoreComponent } from './update-store/update-store.component';
import { StoresComponent } from './stores.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@NgModule({
  declarations: [
    StoresComponent,
    AddStoreComponent,
    StoreTeamComponent,
    StoreRolesComponent,
    StorePlansComponent,
    ViewStoreComponent,
    UpdateStoreComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatSlideToggleModule
  ],
  exports: [
    StoresComponent,
    AddStoreComponent,
    StoreTeamComponent,
    StoreRolesComponent,
    StorePlansComponent,
    ViewStoreComponent,
    UpdateStoreComponent
  ]
})
export class StoresModule { }
