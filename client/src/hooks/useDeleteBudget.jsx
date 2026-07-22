import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteBudget } from "../api/budgetApi";

const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudget,

    onSuccess: () => {
      toast.success("Budget deleted");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete budget"
      );
    },
  });
};

export default useDeleteBudget;