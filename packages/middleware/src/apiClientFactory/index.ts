import { isFunction } from "../helpers";
import { applyContextToApi } from "./applyContextToApi";
import type {
  BaseApiClientFactoryParams,
  ApiClientFactoryResult,
  CreateApiClientFn,
} from "../types/apiClientFactory";

export function apiClientFactory<
  ApiClientFactoryParams extends BaseApiClientFactoryParams
>(
  factoryParams: ApiClientFactoryParams
): ApiClientFactoryResult<ApiClientFactoryParams> {
  const createApiClientFn: CreateApiClientFn<ApiClientFactoryParams> = (
    middlewareContext,
    config,
    customApi = {}
  ) => {
    const rawExtensions = middlewareContext?.extensions || [];

    const lifecycles = rawExtensions
      .filter((extension) => isFunction(extension?.hooks))
      .map(({ hooks }) =>
        hooks(middlewareContext?.req, middlewareContext?.res)
      );

    const extendedApis = rawExtensions.reduce(
      (prev, { extendApiMethods }) => ({ ...prev, ...extendApiMethods }),
      customApi
    );

    const _config = lifecycles
      .filter((extension) => isFunction(extension?.beforeCreate))
      .reduce(
        (configSoFar, extension) =>
          extension.beforeCreate({ configuration: configSoFar }),
        config
      );

    const settings = factoryParams.onCreate
      ? factoryParams.onCreate(_config)
      : { config, client: config.client };

    settings.config = lifecycles
      .filter((extension) => isFunction(extension?.afterCreate))
      .reduce(
        (configSoFar, extension) =>
          extension.afterCreate({ configuration: configSoFar }),
        settings.config
      );

    const extensionHooks = {
      before: (params) =>
        lifecycles
          .filter((extension) => isFunction(extension?.beforeCall))
          .reduce(
            (args, extension) =>
              extension.beforeCall({
                ...params,
                configuration: settings.config,
                args,
              }),
            params.args
          ),
      after: (params) =>
        lifecycles
          .filter((extension) => isFunction(extension.afterCall))
          .reduce(
            (response, extension) =>
              extension.afterCall({
                ...params,
                configuration: settings.config,
                response,
              }),
            params.response
          ),
    };

    const context: any = { ...settings, ...(middlewareContext || {}) };

    const { api: apiOrApiFactory = {} } = factoryParams;

    const isApiFactory = typeof apiOrApiFactory === "function";
    const api = isApiFactory ? apiOrApiFactory(settings) : apiOrApiFactory;
    /**
     * FIXME IN-3487
     *
     * `applyContextToApi` requires `context` to be of type `MiddlewareContextContext`
     * However, the above `const context =` does not satisfy that type.
     *
     * `this.middlewareContext` provides (among others) `{ req: ..., res: ..., ... }`,
     * but `middlewareContext || {}` provides `{ req?: ..., res?: ..., ...}`
     *
     * `MiddlewareContextContext` requires `req` and `res` to be required, not optional, hence the error.
     */
    const integrationApi = applyContextToApi(api, context, extensionHooks);
    const extensionsApi = applyContextToApi(
      extendedApis ?? {},
      context,
      extensionHooks
    );

    const mergedApi = {
      ...integrationApi,
      ...extensionsApi,
    };

    // api methods haven't been invoked yet, so we still have time to add them to the context
    context.api = integrationApi;

    return {
      api: mergedApi,
      client: settings.client,
      settings: settings.config,
    };
  };

  // This is a hack to allow extensions to be added to the apiClientFactory.
  // Otherwise, I'd need to refactor the whole logic of passing extensions...
  const createApiClient: any = createApiClientFn;
  createApiClient._predefinedExtensions = factoryParams.extensions || [];

  return {
    createApiClient,
  };
}
