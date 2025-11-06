import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '../config/contract';

export const useRoundDetails = () => {
  const { data, isLoading, refetch } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getCurrentRoundDetails',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (!data) {
    return {
      roundId: 0n,
      startTime: 0n,
      endTime: 0n,
      prizePool: 0n,
      isActive: false,
      isLoading,
      refetch,
    };
  }

  return {
    roundId: data[0],
    startTime: data[1],
    endTime: data[2],
    prizePool: data[3],
    isActive: data[4],
    isLoading,
    refetch,
  };
};
