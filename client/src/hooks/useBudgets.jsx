import { useQuery } from "@tanstack/react-query";
import { getBudgets } from "../api/budgetApi";

const useBudgets = () => {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: getBudgets,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export default useBudgets;