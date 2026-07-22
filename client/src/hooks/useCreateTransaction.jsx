import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import { createTransaction } from "../api/transactionApi";

const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,

    onSuccess: () => {
      toast.success("Transaction added successfully");

      // refresh transactions everywhere
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to create transaction"
      );
    },
  });
};

export default useCreateTransaction;