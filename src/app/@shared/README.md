The shared module represents the parts of the application that will be frequently reused accross feature modules. It shouldn’t have any dependencies to anywhere in the application, and should not rely on any other first-party module.

Everything created in the shared module should be reusable and lazy-loaded in the feature modules where they are used.

Only include commonly used directives, pipes, and components in the shared module.

Any third-party libraries available as "NgModules" (such as Ng Bootstrap, Material Design, etc) should be imported and exposed through this module.
