import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '../config/contract';

export const useBtcPrice = () => {
  const { data, isLoading, refetch } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getCurrentBtcPrice',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  return {
    btcPrice: data ? Number(data) / 1e8 : 0,
    isLoading,
    refetch,
  };
};
