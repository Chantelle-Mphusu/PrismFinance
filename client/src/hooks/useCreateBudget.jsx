import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createBudget } from "../api/budgetApi";

const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudget,

    onSuccess: () => {
      toast.success("Budget created");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create budget"
      );
    },
  });
};

export default useCreateBudget;