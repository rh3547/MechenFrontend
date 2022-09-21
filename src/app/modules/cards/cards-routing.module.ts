import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteParts, Routes as AppRoutes } from '@routes';
import { AuthGuard, RoleGuard } from '@guards';

// Pages
import { CardDetailsPage } from './pages/card-details/card-details.page';
import { CardSearchPage } from './pages/card-search/card-search.page';
import { CardCreatePage } from './pages/card-create/card-create.page';

const routes: Routes = [
	{ path: "", redirectTo: RouteParts.Cards.CardSearch, pathMatch: "full" },

	{ path: RouteParts.Cards.CardSearch, component: CardSearchPage },
	{ path: RouteParts.Cards.CardSearchPending, component: CardSearchPage },
	{ path: RouteParts.Cards.CardCreate, component: CardCreatePage },
	{ path: RouteParts.Cards.CardEdit, component: CardCreatePage },
	{ path: RouteParts.Cards.CardView, component: CardDetailsPage }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CardsRoutingModule {
	constructor() { }
}
