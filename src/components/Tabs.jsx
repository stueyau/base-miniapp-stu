import { useState } from 'react';
import { colors } from '../styles/colors';

export const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = Array.isArray(children) ? children : [children];

  return (
    <div style={styles.container}>
      <div style={styles.tabsHeader}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              ...styles.tab,
              ...(activeTab === index && styles.tabActive)
            }}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div style={styles.tabContent}>
        {tabs[activeTab]}
      </div>
    </div>
  );
};

export const TabPanel = ({ children }) => {
  return <div>{children}</div>;
};

const styles = {
  container: {
    width: '100%',
  },
  tabsHeader: {
    display: 'flex',
    gap: '4px',
    padding: '0 16px',
    marginBottom: '16px',
    borderBottom: `2px solid ${colors.border}`,
  },
  tab: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '500',
    color: colors.gray500,
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    fontFamily: 'Lexend, sans-serif',
    transition: 'all 0.2s',
    marginBottom: '-2px',
  },
  tabActive: {
    color: colors.baseBlue,
    borderBottomColor: colors.baseBlue,
    fontWeight: '600',
  },
  tabContent: {
    padding: '0',
  },
};
