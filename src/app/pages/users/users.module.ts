import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { UserStatusComponent } from './user-status/user-status.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UsersComponent } from './users.component';



@NgModule({
  declarations: [
    UsersComponent,
    AddUserComponent,
    UpdateUserComponent,
    ViewUserComponent,
    UserRolesComponent,
    UserStatusComponent,
    UserProfileComponent,
    UserSettingsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UsersComponent,
    AddUserComponent,
    UpdateUserComponent,
    ViewUserComponent,
    UserRolesComponent,
    UserStatusComponent,
    UserProfileComponent,
    UserSettingsComponent
  ]
})
export class UsersModule { }
