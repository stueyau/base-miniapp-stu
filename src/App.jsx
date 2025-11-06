import { useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import { WalletConnect } from './components/WalletConnect';
import { RoundInfo } from './components/RoundInfo';
import { PredictionForm } from './components/PredictionForm';
import { PredictionsList } from './components/PredictionsList';
import { RoundHistory } from './components/RoundHistory';
import { Tabs, TabPanel } from './components/Tabs';
import { colors } from './styles/colors';
import './styles/global.css';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize Farcaster SDK and hide splash screen
    const initSDK = async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        sdk.actions.ready();
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
      }
    };

    initSDK();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div style={styles.app}>
          <header style={styles.header}>
            <div style={styles.headerContent}>
              <h1 style={styles.logo}>BTC Prediction Market</h1>
              <p style={styles.subtitle}>Powered by Base</p>
            </div>
          </header>

          <WalletConnect />

          <main style={styles.main}>
            <RoundInfo />
            
            <Tabs>
              <TabPanel label="Make Prediction">
                <PredictionForm />
                <PredictionsList />
              </TabPanel>
              
              <TabPanel label="History">
                <RoundHistory />
              </TabPanel>
            </Tabs>
          </main>

          <footer style={styles.footer}>
            <p style={styles.footerText}>
              Entry fee: 0.000001 ETH • Winner gets 90% • Owner gets 10%
            </p>
          </footer>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const styles = {
  app: {
    width: '100%',
    maxWidth: '424px',
    height: '695px',
    margin: '0 auto',
    backgroundColor: colors.backgroundDark,
    fontFamily: 'Lexend, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: colors.baseBlue,
    color: colors.baseWhite,
    padding: '16px 20px',
    textAlign: 'center',
    flexShrink: 0,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 0 4px 0',
    fontFamily: 'Lexend, sans-serif',
  },
  subtitle: {
    fontSize: '12px',
    margin: 0,
    opacity: 0.9,
    fontFamily: 'Lexend, sans-serif',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 0',
  },
  footer: {
    backgroundColor: colors.background,
    borderTop: `1px solid ${colors.border}`,
    padding: '12px 16px',
    textAlign: 'center',
    flexShrink: 0,
  },
  footerText: {
    fontSize: '10px',
    color: colors.gray500,
    margin: 0,
    fontFamily: 'Lexend, sans-serif',
  },
};

export default App;
