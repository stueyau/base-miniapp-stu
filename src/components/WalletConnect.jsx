import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { formatAddress } from '../utils/formatters';
import { colors } from '../styles/colors';

export const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div style={styles.container}>
        <div style={styles.connectedWrapper}>
          <div style={styles.connectedInfo}>
            <span style={styles.connectedDot}></span>
            <span style={styles.address}>{formatAddress(address)}</span>
          </div>
          <button onClick={() => disconnect()} style={styles.disconnectButton}>
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.centerWrapper}>
        <button
          onClick={() => connect({ connector: connectors[0] })}
          style={styles.connectButton}
          disabled={connectors.length === 0}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: colors.background,
    borderBottom: `1px solid ${colors.border}`,
    flexShrink: 0,
  },
  centerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  connectedWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100%',
  },
  connectedInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: colors.success + '15',
    borderRadius: '16px',
  },
  connectedDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: colors.success,
  },
  address: {
    fontSize: '12px',
    fontWeight: '600',
    color: colors.baseBlack,
    fontFamily: 'Lexend, monospace',
  },
  connectButton: {
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: '600',
    color: colors.baseWhite,
    backgroundColor: colors.baseBlue,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'Lexend, sans-serif',
    transition: 'all 0.2s',
  },
  disconnectButton: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    color: colors.error,
    backgroundColor: 'transparent',
    border: `1px solid ${colors.error}`,
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'Lexend, sans-serif',
    transition: 'all 0.2s',
  },
};
