import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { loadRolesSuccess } from "src/state/actions/roles.actions";
import { Roles, Permissions } from "src/state/dataset";
import { RolesState } from "src/state/reducers/roles.reducer";

@Injectable (
    {providedIn: "root"}
)

export class RoleApiService {
    constructor(
        private store: Store<RolesState>
    ) { }

    createInitialRolesState() {
        const initialState: RolesState = {
            roles: Roles,
            loading: false
        }
        
        this.store.dispatch(loadRolesSuccess(initialState.roles));
    }

    getRoleById(id: string) {
        const role = Roles.filter(role => role.id === id);

        if (role.length === 0) {
            return null;
        }

        return role[0];
    }

    getAllPermissions() {
        return Permissions;
    }

    getAllPermissionIdsByRole(roleId: string) {
        const role = Roles.filter(role => role.id === roleId);
        const permissionIds = role[0].permissionsId.map(permissionId => {
            const permission = Permissions.find(permission => permission.id === permissionId);
            return permission ? permission.id : null;
        });

        if (permissionIds.length === 0) {
            return [];
        }

        return permissionIds;
    }
}