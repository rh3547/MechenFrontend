The core module represents the root of the application that will always be loaded once and only once. Everything in the root module should be considered a singleton, containing only root-scoped services, static components that won't be needed in feature modules (header, nav, sidebar, etc), universal interceptors/guards, constants, universal models, and common utilities.

Nothing should be added to the core.module.ts declarations, imports, or providers. Anything from the core module that is needed elsewhere can be imported directly as needed (root services, direct model imports, etc).

Any components in the core module should only be usable within the core pages (app.component.ts|html). If you need to make a component that is reusable throughout feature modules, add it to the shared module instead.

Only include universal, base-level models in the common module (Maintenance, PageRequest, SortRequest, etc). No domain-specific models should be declared here.
