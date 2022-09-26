/*
	These routes parts should only be used in routing modules to build routes linking to modules/components.
*/
export var RouteParts = {
	Root: "",
	Generic: {
		NotFound: "404",
		Unauthorized: "401"
	},
	Auth: {
		AuthRoot: "",
		Login: "login",
		Register: "register",
		AccountSetup: "account-setup",
		ForgotPassword: "forgot-password",
		RecoverPassword: "recover-password"
	},
	Cards: {
		CardsRoot: "cards",
		CardSearch: "search",
		CardSearchPending: "pending",
		CardView: ":id",
		CardCreate: "create",
		CardEdit: "edit/:id"
	},
	Decks: {
		DecksRoot: "decks",
		DeckSearch: "search",
		DeckView: ":id",
		DeckCreate: "create",
		DeckEdit: "edit/:id"
	}
};

/*
	These routes should be used throughout the application's pages for navigation.
	If a route has route params, use the "resolveRouteParams" function to handle adding them in the route.
*/
export var Routes = {
	Root: buildRoute([RouteParts.Root]),
	Generic: {
		NotFound: buildRoute([RouteParts.Generic.NotFound]),
		Unauthorized: buildRoute([RouteParts.Generic.Unauthorized])
	},
	Auth: {
		Login: buildRoute([RouteParts.Auth.AuthRoot, RouteParts.Auth.Login]),
		Register: buildRoute([RouteParts.Auth.AuthRoot, RouteParts.Auth.Register]),
		AccountSetup: buildRoute([RouteParts.Auth.AuthRoot, RouteParts.Auth.AccountSetup]),
		ForgotPassword: buildRoute([RouteParts.Auth.AuthRoot, RouteParts.Auth.ForgotPassword]),
		RecoverPassword: buildRoute([RouteParts.Auth.AuthRoot, RouteParts.Auth.RecoverPassword])
	},
	Cards: {
		CardsRoot: buildRoute([RouteParts.Cards.CardsRoot]),
		CardSearch: buildRoute([RouteParts.Cards.CardsRoot, RouteParts.Cards.CardSearch]),
		CardSearchPending: buildRoute([RouteParts.Cards.CardsRoot, RouteParts.Cards.CardSearchPending]),
		CardView: buildRoute([RouteParts.Cards.CardsRoot, RouteParts.Cards.CardView]),
		CardCreate: buildRoute([RouteParts.Cards.CardsRoot, RouteParts.Cards.CardCreate]),
		CardEdit: buildRoute([RouteParts.Cards.CardsRoot, RouteParts.Cards.CardEdit])
	},
	Decks: {
		DecksRoot: buildRoute([RouteParts.Decks.DecksRoot]),
		DeckSearch: buildRoute([RouteParts.Decks.DecksRoot, RouteParts.Decks.DeckSearch]),
		DeckView: buildRoute([RouteParts.Decks.DecksRoot, RouteParts.Decks.DeckView]),
		DeckCreate: buildRoute([RouteParts.Decks.DecksRoot, RouteParts.Decks.DeckCreate]),
		DeckEdit: buildRoute([RouteParts.Decks.DecksRoot, RouteParts.Decks.DeckEdit])
	}
};

/*
	Given an array of route parts, builds a string representing a route with preper slashes and empty route parts handled.
	@param: routeParts: string[] (["", "users", ":id"])
	@returns: A combined and proper route ("/users/:id")
*/
export function buildRoute(routeParts: string[]): string {
	let joinArray = [RouteParts.Root].concat(routeParts);
	return "/" + joinArray.filter(value => value != "").join("/");
};

/*
	Given a route with unset parameters and a map of values for those parameters, returns a fully resolved route with inserted parameters.
	@param: route: string ("/users/:id")
	@param: paramsMap: any ({ id: 2 })
	@returns: A resolved route ("/users/2")
*/
export function resolveRouteParams(route: string, paramsMap: any): string {
	let resolvedRoute = route;
	Object.keys(paramsMap).forEach((param) => {
		resolvedRoute = resolvedRoute.replace(`:${param}`, paramsMap[param]);
	});
	return resolvedRoute;
};
