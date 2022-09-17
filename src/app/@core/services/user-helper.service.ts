import { Injectable } from '@angular/core';
import { AuthProxy, UserService } from '@ng-nuc/core';

@Injectable({
  providedIn: 'root'
})
export class UserHelperService {

  constructor(
		private authProxy: AuthProxy,
    private userService: UserService
  ) { }

  public getUser(): Promise<any>{
    return new Promise(async (resolve) => {
      var user = this.userService.getCurrentUser();
      if(user) {
        resolve(user);
      }
      else {
        setTimeout(() => {
          resolve(this.getUser());
        }, 500);
      }
    });
  }

	public getUserRoles(): Promise<any>{
    return new Promise(async (resolve, reject) => {
      this.authProxy.getCurrentUser().then((user) => {
        resolve(user.roles);
      },
      (err) => {
        console.error(err);
        reject([]);
      });
    });
  }

	public userIsInRoles(roles: string[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let roleFound: boolean = false;
      let user = this.userService.getCurrentUser();

      if (!user) {
        reject(roleFound);
      }
      else if (user && user.roles != undefined) {
        roles.forEach(role => {
          user.roles.forEach(userRole => {
            if (userRole.toString().toUpperCase() === role.toUpperCase()) {
              roleFound = true;
            }
          });
        });
        resolve(roleFound);
      }
      else {
        resolve(roleFound);
      }
    });
  }
}
