import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '../config/contract';

export const usePredictions = (roundId) => {
  const { data, isLoading, refetch } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getRoundPredictions',
    args: roundId ? [roundId] : undefined,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  return {
    predictions: data || [],
    isLoading,
    refetch,
  };
};
