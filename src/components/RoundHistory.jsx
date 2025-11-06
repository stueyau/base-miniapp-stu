import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '../config/contract';
import { formatAddress, formatPrice, formatEth } from '../utils/formatters';
import { colors } from '../styles/colors';

export const RoundHistory = () => {
  const [selectedRound, setSelectedRound] = useState(null);
  const { data: currentRoundId } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'currentRoundId',
  });

  const roundIds = currentRoundId ? Array.from(
    { length: Math.max(0, Number(currentRoundId) - 1) },
    (_, i) => BigInt(Number(currentRoundId) - 1 - i)
  ).slice(0, 10) : [];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Round History</h3>
      
      {roundIds.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No completed rounds yet</p>
        </div>
      ) : (
        <div style={styles.listContainer}>
          {roundIds.map((roundId) => (
            <RoundHistoryItem 
              key={roundId.toString()} 
              roundId={roundId}
              isExpanded={selectedRound === roundId.toString()}
              onToggle={() => setSelectedRound(
                selectedRound === roundId.toString() ? null : roundId.toString()
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RoundHistoryItem = ({ roundId, isExpanded, onToggle }) => {
  const { data: winner } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getRoundWinner',
    args: [roundId],
  });

  if (!winner || !winner[4]) {
    return null;
  }

  const [winnerAddress, winningPrice, finalBtcPrice, prizePool] = winner;

  return (
    <div style={styles.historyCard}>
      <div style={styles.historyHeader} onClick={onToggle}>
        <div style={styles.historyHeaderLeft}>
          <span style={styles.roundNumber}>Round #{roundId.toString()}</span>
          <span style={styles.winnerBadge}>Winner: {formatAddress(winnerAddress)}</span>
        </div>
        <span style={styles.expandIcon}>{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div style={styles.historyDetails}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Winning Prediction:</span>
            <span style={styles.detailValue}>
              ${formatPrice(Number(winningPrice) / 1e8)}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Final BTC Price:</span>
            <span style={styles.detailValue}>
              ${formatPrice(Number(finalBtcPrice) / 1e8)}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Prize Pool:</span>
            <span style={styles.detailValueHighlight}>
              {formatEth(prizePool)} ETH
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Winner Address:</span>
            <span style={styles.detailAddress}>
              {winnerAddress}
            </span>
          </div>
        </div>
      )}
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
  title: {
    fontSize: '16px',
    fontWeight: '700',
    color: colors.baseBlack,
    margin: '0 0 12px 0',
    fontFamily: 'Lexend, sans-serif',
  },
  emptyState: {
    textAlign: 'center',
    padding: '24px 16px',
    backgroundColor: colors.backgroundDark,
    borderRadius: '8px',
  },
  emptyText: {
    color: colors.gray500,
    fontSize: '13px',
    margin: 0,
    fontFamily: 'Lexend, sans-serif',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  historyCard: {
    backgroundColor: colors.backgroundDark,
    borderRadius: '8px',
    overflow: 'visible',
    border: `1px solid ${colors.border}`,
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  historyHeaderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  roundNumber: {
    fontSize: '14px',
    fontWeight: '700',
    color: colors.baseBlack,
    fontFamily: 'Lexend, sans-serif',
  },
  winnerBadge: {
    fontSize: '11px',
    color: colors.gray500,
    fontFamily: 'Lexend, sans-serif',
  },
  expandIcon: {
    fontSize: '20px',
    color: colors.gray500,
    fontWeight: '300',
    fontFamily: 'Lexend, sans-serif',
  },
  historyDetails: {
    padding: '0 12px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: `1px solid ${colors.border}`,
    paddingTop: '12px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    minHeight: '20px',
  },
  detailLabel: {
    fontSize: '11px',
    color: colors.gray500,
    fontFamily: 'Lexend, sans-serif',
    flexShrink: 0,
  },
  detailValue: {
    fontSize: '12px',
    fontWeight: '600',
    color: colors.baseBlack,
    fontFamily: 'Lexend, sans-serif',
    textAlign: 'right',
  },
  detailValueHighlight: {
    fontSize: '12px',
    fontWeight: '700',
    color: colors.baseBlue,
    fontFamily: 'Lexend, sans-serif',
    textAlign: 'right',
  },
  detailAddress: {
    fontSize: '10px',
    color: colors.gray600,
    fontFamily: 'Lexend, monospace',
    wordBreak: 'break-all',
    textAlign: 'right',
    maxWidth: '55%',
    lineHeight: '1.4',
  },
};
