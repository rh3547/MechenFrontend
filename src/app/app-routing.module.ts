import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes as NgRoutes } from '@angular/router';
import { RouteParts } from '@routes';
import { AuthGuard, RoleGuard } from '@guards';

import { FourZeroFourPage } from '@pages/404/404.page';
import { FourZeroOnePage } from '@pages/401/401.page';

const routes: NgRoutes = [
	// Redirect example
	{ path: RouteParts.Root, redirectTo: RouteParts.Cards.CardsRoot, pathMatch: "full" },

	// Public
	{ path: RouteParts.Cards.CardsRoot, loadChildren: () => import('@modules/cards/cards.module').then((m) => m.CardsModule) },
	{ path: RouteParts.Decks.DecksRoot, loadChildren: () => import('@modules/decks/decks.module').then((m) => m.DecksModule) },

	// Guarded
	// Example of role guard with allowed roles
	//{ path: RouteParts.Users.UsersRoot, loadChildren: () => import('@modules/user-management/user-management.module').then((m) => m.UserManagementModule), canActivate: [AuthGuard, RoleGuard], data: { allowedRoles: ["SiteAdmin"] } },

	// Not found page and wildcard redirect (keep at the bottom)
	{ path: RouteParts.Generic.NotFound, component: FourZeroFourPage },
	{ path: RouteParts.Generic.Unauthorized, component: FourZeroOnePage },
	{ path: '**', redirectTo: RouteParts.Generic.NotFound, pathMatch: 'full' }
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			preloadingStrategy: PreloadAllModules,
			relativeLinkResolution: 'legacy',
			useHash: false,
			anchorScrolling: "enabled"
		})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
