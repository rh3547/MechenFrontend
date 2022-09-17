import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgnCoreModule } from '@ng-nuc/core';
import { NgnComponentsModule } from '@ng-nuc/components';

import { AuthRoutingModule } from './auth-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule, IConfig } from 'ngx-mask';

// PAGES
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { RecoverPasswordPage } from './pages/recover-password/recover-password.page';
import { AccountSetupPage } from './pages/account-setup/account-setup.page';

export const maskConfig: Partial<IConfig> = {
	dropSpecialCharacters: false
};
@NgModule({
	declarations: [
		LoginPage,
		RegisterPage,
		ForgotPasswordPage,
		RecoverPasswordPage,
		AccountSetupPage
	],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		AuthRoutingModule,
		NgxSmartModalModule.forRoot(),
		NgnCoreModule,
		NgnComponentsModule,
		NgbModule,
		NgxMaskModule.forRoot(maskConfig)
	],
	providers: []
})
export class AuthModule { }
