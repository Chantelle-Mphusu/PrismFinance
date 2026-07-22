import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateBudget } from "../api/budgetApi";

const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudget,

    onSuccess: () => {
      toast.success("Budget updated");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update budget"
      );
    },
  });
};

export default useUpdateBudget;