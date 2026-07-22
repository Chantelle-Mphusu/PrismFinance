import { useQuery } from "@tanstack/react-query";

import { fetchTransactions } from "../api/transactionApi.js";

const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],

    queryFn: fetchTransactions,

    staleTime: 1000 * 60 * 5,
  });
};

export default useTransactions;