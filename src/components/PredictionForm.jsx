import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '../config/contract';
import { useBtcPrice } from '../hooks/useBtcPrice';
import { useRoundDetails } from '../hooks/useRoundDetails';
import { formatPrice } from '../utils/formatters';
import { colors } from '../styles/colors';

export const PredictionForm = () => {
  const [predictedPrice, setPredictedPrice] = useState('');
  const { address, isConnected } = useAccount();
  const { btcPrice } = useBtcPrice();
  const { isActive, refetch: refetchRound } = useRoundDetails();
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected || !predictedPrice) return;

    try {
      // Convert price to Chainlink format (8 decimals)
      const priceWith8Decimals = Math.floor(parseFloat(predictedPrice) * 1e8);
      
      writeContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'submitPrediction',
        args: [BigInt(priceWith8Decimals)],
        value: parseEther('0.000001'),
      });
    } catch (error) {
      console.error('Error submitting prediction:', error);
    }
  };

  if (isSuccess) {
    setTimeout(() => {
      setPredictedPrice('');
      refetchRound();
    }, 2000);
  }

  if (!isActive) {
    return (
      <div style={styles.inactiveContainer}>
        <p style={styles.inactiveText}>Round not active. Waiting for next round...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.priceDisplay}>
        <span style={styles.priceLabel}>Current BTC Price:</span>
        <span style={styles.priceValue}>${formatPrice(btcPrice)}</span>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Your Prediction</label>
          <div style={styles.inputWrapper}>
            <span style={styles.inputPrefix}>$</span>
            <input
              type="number"
              step="0.01"
              value={predictedPrice}
              onChange={(e) => setPredictedPrice(e.target.value)}
              placeholder="Enter BTC price prediction"
              style={styles.input}
              disabled={!isConnected || isPending || isConfirming}
            />
          </div>
        </div>

        <div style={styles.feeInfo}>
          <span style={styles.feeLabel}>Entry Fee:</span>
          <span style={styles.feeValue}>0.000001 ETH</span>
        </div>

        <button
          type="submit"
          disabled={!isConnected || !predictedPrice || isPending || isConfirming}
          style={{
            ...styles.button,
            ...((!isConnected || !predictedPrice || isPending || isConfirming) && styles.buttonDisabled)
          }}
        >
          {!isConnected ? 'Connect Wallet' : 
           isPending ? 'Confirming...' :
           isConfirming ? 'Processing...' :
           isSuccess ? '✓ Submitted!' :
           'Submit Prediction'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: colors.background,
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${colors.border}`,
    margin: '0 16px 16px 16px',
  },
  inactiveContainer: {
    backgroundColor: colors.backgroundDark,
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    margin: '0 16px 16px 16px',
  },
  inactiveText: {
    fontSize: '14px',
    color: colors.gray500,
    margin: 0,
    fontFamily: 'Lexend, sans-serif',
  },
  priceDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: colors.backgroundDark,
    borderRadius: '8px',
    marginBottom: '12px',
  },
  priceLabel: {
    fontSize: '12px',
    color: colors.gray500,
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: '16px',
    color: colors.baseBlack,
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    color: colors.gray600,
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputPrefix: {
    position: 'absolute',
    left: '14px',
    fontSize: '16px',
    color: colors.gray500,
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 32px',
    fontSize: '14px',
    border: `2px solid ${colors.border}`,
    borderRadius: '8px',
    outline: 'none',
    fontFamily: 'Lexend, sans-serif',
    transition: 'border-color 0.2s',
    backgroundColor: colors.background,
  },
  feeInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: colors.backgroundDark,
    borderRadius: '8px',
  },
  feeLabel: {
    fontSize: '12px',
    color: colors.gray500,
    fontFamily: 'Lexend, sans-serif',
  },
  feeValue: {
    fontSize: '12px',
    color: colors.baseBlack,
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '600',
  },
  button: {
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: colors.baseWhite,
    backgroundColor: colors.baseBlue,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'Lexend, sans-serif',
    transition: 'all 0.2s',
  },
  buttonDisabled: {
    backgroundColor: colors.gray300,
    cursor: 'not-allowed',
  },
};
