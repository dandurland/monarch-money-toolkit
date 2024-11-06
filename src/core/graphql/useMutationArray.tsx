import { useApolloClient } from "@apollo/client";
import { useEffect, useState } from "react";

export function useMutationArray(query: any, variables: any[]) {

  const client = useApolloClient();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {

    if (isProcessing) {
      const executeMutation = async () => {
        const mutation = variables.shift();
        if (!mutation) {
          setIsProcessing(false);
          return;
        }

        try {
          const result = await client.mutate({
            variables: mutation,
            mutation: query
          });


        } catch (e) {

        } finally {

        }

        executeMutation();
      };

      executeMutation();
    }
  }), [isProcessing, variables];

  const execute = () => {
    setIsProcessing(true);
  }

  return { isProcessing, execute }
}