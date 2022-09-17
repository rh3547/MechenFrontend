import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteParts } from '@routes';

import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { RecoverPasswordPage } from './pages/recover-password/recover-password.page';
import { AccountSetupPage } from './pages/account-setup/account-setup.page';

const routes: Routes = [
	{ path: RouteParts.Auth.Login, component: LoginPage },
	{ path: RouteParts.Auth.Register, component: RegisterPage },
	{ path: RouteParts.Auth.ForgotPassword, component: ForgotPasswordPage },
	{ path: RouteParts.Auth.RecoverPassword, component: RecoverPasswordPage },
	{ path: RouteParts.Auth.AccountSetup, component: AccountSetupPage }
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuthRoutingModule { }
