import { useRoundDetails } from '../hooks/useRoundDetails';
import { usePredictions } from '../hooks/usePredictions';
import { formatAddress, formatPrice, formatTimestamp } from '../utils/formatters';
import { colors } from '../styles/colors';

export const PredictionsList = () => {
  const { roundId } = useRoundDetails();
  const { predictions, isLoading } = usePredictions(roundId);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>Live Predictions</h3>
        <div style={styles.loadingText}>Loading predictions...</div>
      </div>
    );
  }

  const sortedPredictions = predictions ? [...predictions].reverse() : [];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Live Predictions</h3>
        <span style={styles.count}>{predictions?.length || 0} entries</span>
      </div>

      {sortedPredictions.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No predictions yet. Be the first!</p>
        </div>
      ) : (
        <div style={styles.listContainer}>
          {sortedPredictions.map((prediction, index) => (
            <div key={index} style={styles.predictionCard}>
              <div style={styles.predictionHeader}>
                <span style={styles.address}>
                  {formatAddress(prediction.user)}
                </span>
                <span style={styles.timestamp}>
                  {formatTimestamp(prediction.timestamp)}
                </span>
              </div>
              <div style={styles.predictionPrice}>
                ${formatPrice(Number(prediction.predictedPrice) / 1e8)}
              </div>
            </div>
          ))}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '700',
    color: colors.baseBlack,
    margin: 0,
    fontFamily: 'Lexend, sans-serif',
  },
  count: {
    fontSize: '12px',
    color: colors.gray500,
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    color: colors.gray500,
    fontSize: '14px',
    padding: '20px',
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
    maxHeight: '250px',
    overflowY: 'auto',
  },
  predictionCard: {
    backgroundColor: colors.backgroundDark,
    padding: '12px',
    borderRadius: '8px',
    transition: 'transform 0.2s',
  },
  predictionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  address: {
    fontSize: '11px',
    color: colors.gray600,
    fontFamily: 'Lexend, monospace',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: '10px',
    color: colors.gray400,
    fontFamily: 'Lexend, sans-serif',
  },
  predictionPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: colors.baseBlue,
    fontFamily: 'Lexend, sans-serif',
  },
};
