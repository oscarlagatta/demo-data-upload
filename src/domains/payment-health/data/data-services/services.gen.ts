import { createClient, createConfig } from "@hey-api/client-axios"
import type {
  GetApiV2SplunkDataGetAmountTransactionDetailsDataData,
  GetApiV2SplunkDataGetAmountTransactionDetailsDataError,
  GetApiV2SplunkDataGetAmountTransactionDetailsDataResponse,
  GetApiV2SplunkDataGetSplunkDataResponse,
  GetApiV2SplunkDataGetTransactionDetailsDataData,
  GetApiV2SplunkDataGetTransactionDetailsDataError,
  GetApiV3SplunkDataGetSplunkDataError,
} from "@/domains/payment-health/data/data-services/types,gen"
import type { GetApiV2SplunkDataGetTransactionDetailsDataResponse } from "@/domains/payment-health/types/transaction-details-data-response"
// import splunkUsWiresData from '@/domains/payment-health/assets/flow-data-us-wires/get-splunk-us-wires-data.json';

export const client = createClient(createConfig())

export const getApiV2SplunkDataGetSplunkData = <ThrowOnError extends boolean = false>(options?: {
  client?: typeof client
  throwOnError?: ThrowOnError
}) => {
  return (options?.client ?? client).get<
    GetApiV2SplunkDataGetSplunkDataResponse,
    GetApiV3SplunkDataGetSplunkDataError,
    ThrowOnError
  >({
    url: `/api/v2/splunk/data/GetSplunkData`,
    throwOnError: options?.throwOnError,
  })
}

export const getApiV2SplunkDataGetAmountTransactionDetailsData = <ThrowOnError extends boolean = false>(options?: {
  query?: GetApiV2SplunkDataGetAmountTransactionDetailsDataData["query"]
  client?: typeof client
  throwOnError?: ThrowOnError
}) => {
  return (options?.client ?? client).get<
    GetApiV2SplunkDataGetAmountTransactionDetailsDataResponse,
    GetApiV2SplunkDataGetAmountTransactionDetailsDataError,
    ThrowOnError
  >({
    url: `/api/v2/splunk/data/getAmountTransactionDetailsData`,
    query: options?.query,
    throwOnError: options?.throwOnError,
  })
}

export const getApiV2SplunkDataGetTransactionDetailsData = <ThrowOnError extends boolean = false>(options?: {
  query?: GetApiV2SplunkDataGetTransactionDetailsDataData["query"]
  client?: typeof client
  throwOnError?: ThrowOnError
}) => {
  return (options?.client ?? client).get<
    GetApiV2SplunkDataGetTransactionDetailsDataResponse,
    GetApiV2SplunkDataGetTransactionDetailsDataError,
    ThrowOnError
  >({
    url: `/api/v2/splunk/data/getTransactionDetailsData`,
    query: options?.query,
    throwOnError: options?.throwOnError,
  })
}
