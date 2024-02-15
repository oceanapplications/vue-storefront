import { isRequestConfig } from "../consts";
import { MethodConfig, RequestConfig } from "../types";

/**
 * Prepare the config for the request.
 * It's used to differentiate the method config from the params.
 *
 * @example
 * Usage
 * ```ts
 * import { prepareConfig } from "@vue-storefront/sdk";
 *
 * const products = sdk.commerce.getProducts(params, prepareConfig({ method: "GET" }));
 * ```
 */
export const prepareConfig = <
  CustomConfig extends RequestConfig = RequestConfig
>(
  requestConfig: CustomConfig
): MethodConfig => {
  return {
    ...requestConfig,
    [isRequestConfig]: true,
  };
};
