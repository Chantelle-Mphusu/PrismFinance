import { useMutation } from "@tanstack/react-query";

import { toast } from "react-toastify";

import { changePassword } from "../api/settingsApi";

const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,

    onSuccess: () => {
      toast.success("Password updated");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to change password"
      );
    },
  });
};

export default useChangePassword;