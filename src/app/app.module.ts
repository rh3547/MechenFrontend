import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { CoreComponent } from '@core/core.component';
import { CoreModule } from '@core/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Declaration needed for ngx-smart-modal
declare module "@angular/core" {
	interface ModuleWithProviders<T = any> {
		ngModule: Type<T>;
		providers?: Provider[];
	}
}
@NgModule({
	declarations: [
		CoreComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		CoreModule,
		AppRoutingModule,
		NgbModule,
	],
	providers: [

	],
	bootstrap: [
		CoreComponent
	]
})
export class AppModule { }
