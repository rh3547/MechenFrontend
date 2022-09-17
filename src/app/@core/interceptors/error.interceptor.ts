import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Routes } from '@routes';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private router: Router) { }

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				if ([401, 403].includes(error.status)) {
					this.router.navigateByUrl(`/${Routes.Auth.Login}`);
					return throwError(error);
				}
				else if (error.status === 500) {
					console.error(error);
					return throwError(error);
				}
				else {
					return throwError(error);
				}
			}),
		);
	}
}
