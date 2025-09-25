import { useQuery } from '@tanstack/react-query';

import {
  getApiV2SplunkDataGetWireFlowOptions,  
} from '../../data/data-services/react-query.gen';

interface UseGetSplunkWiresFlowOptions {
    enabled?: boolean = false,
    isMonitored?: boolean = false
}

export function useGetSplunkWiresFlow(
  options: UseGetSplunkWiresFlowOptions
) {

    const { enabled, isMonitored } = options;

  return useQuery({
    ...getApiV2SplunkDataGetWireFlowOptions({
      query: {
        isMonitored
      },
    }),
    enabled,
  });
}
