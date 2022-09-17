export const environment = {
	envName: "qa",
	production: false,

	// Grid config
	defaultGridPageSize: 10,

	// API Config
	apiUrl: "https://localhost:44341",
	apiUrlExtension: "/api/v1",

	// OpenIddict config
	oiGrantType: "password",
	oiGrantTypeRefresh: "refresh_token",
	oiScope: "openid offline_access",
	oiClientId: "Nucleus",
	sessionRenewalNotificationThresholdInMinutes: 1,
	token_endpoint: "/Auth/token",
  revoke_endpoint: "/Auth/revoke",
  refresh_endpoint: "/Auth/token"

	// Cognito config
	// user_pool_id: "us-east-1_M75h6e7MK",
  // app_client_id: "7ndes6uau0hhq1ubr7n6jehsj5",
  // region: "us-east-1"
};
