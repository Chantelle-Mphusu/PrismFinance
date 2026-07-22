import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import { updateSettings } from "../api/settingsApi";

const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,

    onSuccess: () => {
      toast.success("Settings updated");

      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });

      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update settings"
      );
    },
  });
};

export default useUpdateSettings;