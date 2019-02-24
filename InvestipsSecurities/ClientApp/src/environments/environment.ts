// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    production: true,
    stockMarketQuotesWithIndicatorsApiBaseUrl: 'https://warm-journey-46979.herokuapp.com',
    udfApiBaseUrl: 'http://localhost:50894',
    stockMarketUDFApiBaseUrl: 'https://enigmatic-waters-56889.herokuapp.com',
    investipsServerWebAPIBaseUrl: 'http://localhost:3308',
    investipsDotnetApi: 'http://investipsapi.azurewebsites.net'

    // production: false,
    // stockMarketQuotesWithIndicatorsApiBaseUrl: 'http://localhost:4000',
    // stockMarketUDFApiBaseUrl: 'http://localhost:4600',
    // investipsServerWebAPIBaseUrl: 'http://localhost:3308',
    // investipsDotnetApi: 'http://investipsapi.azurewebsites.net'
};
