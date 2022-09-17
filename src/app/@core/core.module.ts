import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ErrorInterceptor } from './interceptors';
import { NgxNotificationMsgModule } from 'ngx-notification-msg';
import { AuthInterceptor } from '@ng-nuc/core';

import { FourZeroFourPage } from './pages/404/404.page';
import { FourZeroOnePage } from './pages/401/401.page';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [
		FourZeroFourPage,
		FourZeroOnePage
	],
	imports: [
		CommonModule,
		HttpClientModule,
		NgxNotificationMsgModule,
		RouterModule
	],
	providers: [
		// Uncomment to add auth for outgoing API calls
		// {
		// 	provide: HTTP_INTERCEPTORS,
		// 	useClass: AuthInterceptor,
		// 	multi: true
		// }
	]
})
export class CoreModule { }
