import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewUserComponent } from './view-user/view-user.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { UserStatusComponent } from './user-status/user-status.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UsersComponent } from './users.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@NgModule({
  declarations: [
    UsersComponent,
    ViewUserComponent,
    UserRolesComponent,
    UserStatusComponent,
    UserProfileComponent,
    UserSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  exports: [
    UsersComponent,
    ViewUserComponent,
    UserRolesComponent,
    UserStatusComponent,
    UserProfileComponent,
    UserSettingsComponent
  ]
})
export class UsersModule { }
