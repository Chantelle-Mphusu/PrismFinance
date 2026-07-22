import { useQuery } from "@tanstack/react-query";

import { getSettings } from "../api/settingsApi";

const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],

    queryFn: getSettings,

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};

export default useSettings;