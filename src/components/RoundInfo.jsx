import { useRoundDetails } from '../hooks/useRoundDetails';
import { useCountdown } from '../hooks/useCountdown';
import { formatCountdown, formatEth } from '../utils/formatters';
import { colors } from '../styles/colors';

export const RoundInfo = () => {
  const { roundId, endTime, prizePool, isActive, isLoading } = useRoundDetails();
  const timeLeft = useCountdown(endTime);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading round info...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Round #{roundId?.toString() || '0'}</h2>
        {isActive && (
          <span style={styles.activeBadge}>
            <span style={styles.activeDot}></span>
            Active
          </span>
        )}
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Time Remaining</div>
          <div style={{
            ...styles.statValue,
            color: timeLeft < 60 ? colors.error : colors.baseBlack
          }}>
            {isActive ? formatCountdown(timeLeft) : '--:--'}
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Prize Pool</div>
          <div style={styles.statValue}>
            {formatEth(prizePool)} ETH
          </div>
        </div>
      </div>

      <div style={styles.infoBox}>
        <p style={styles.infoText}>
          Predict the BTC price at the end of this round. Closest prediction wins 90% of the pool!
        </p>
      </div>
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
  loadingText: {
    textAlign: 'center',
    color: colors.gray500,
    fontSize: '16px',
    fontFamily: 'Lexend, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: colors.baseBlack,
    margin: 0,
    fontFamily: 'Lexend, sans-serif',
  },
  activeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: colors.success + '15',
    color: colors.success,
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: 'Lexend, sans-serif',
  },
  activeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: colors.success,
    animation: 'pulse 2s infinite',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '12px',
  },
  statCard: {
    backgroundColor: colors.backgroundDark,
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '12px',
    color: colors.gray500,
    marginBottom: '8px',
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: colors.baseBlack,
    fontFamily: 'Lexend, sans-serif',
  },
  infoBox: {
    backgroundColor: colors.baseBlue + '10',
    padding: '12px',
    borderRadius: '8px',
    borderLeft: `4px solid ${colors.baseBlue}`,
  },
  infoText: {
    fontSize: '12px',
    color: colors.gray700,
    margin: 0,
    lineHeight: '1.5',
    fontFamily: 'Lexend, sans-serif',
  },
};
