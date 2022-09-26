import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteParts, Routes as AppRoutes } from '@routes';
import { AuthGuard, RoleGuard } from '@guards';

// Pages
import { DeckSearchPage } from './pages/deck-search/deck-search.page';
import { DeckCreatePage } from './pages/deck-create/deck-create.page';
import { DeckViewPage } from './pages/deck-view/deck-view.page';

const routes: Routes = [
	{ path: "", redirectTo: RouteParts.Decks.DeckSearch, pathMatch: "full" },

	{ path: RouteParts.Decks.DeckSearch, component: DeckSearchPage },
	{ path: RouteParts.Decks.DeckCreate, component: DeckCreatePage },
	{ path: RouteParts.Cards.CardEdit, component: DeckCreatePage },
	{ path: RouteParts.Cards.CardView, component: DeckViewPage }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DecksRoutingModule {
	constructor() { }
}
