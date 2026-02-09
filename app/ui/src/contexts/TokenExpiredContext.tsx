import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import TokenExpiredModal from '../components/TokenExpiredModal/TokenExpiredModal';

interface TokenExpiredContextType {
  showTokenExpiredModal: () => void;
}

const TokenExpiredContext = createContext<TokenExpiredContextType | undefined>(undefined);

export const useTokenExpired = () => {
  const context = useContext(TokenExpiredContext);
  if (!context) {
    throw new Error('useTokenExpired must be used within a TokenExpiredProvider');
  }
  return context;
};

interface TokenExpiredProviderProps {
  children: ReactNode;
}

export const TokenExpiredProvider: React.FC<TokenExpiredProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();

  const showTokenExpiredModal = () => {
    setIsModalOpen(true);
  };

  return (
    <TokenExpiredContext.Provider value={{ showTokenExpiredModal }}>
      {children}
      {isModalOpen && (
        <TokenExpiredModal
          open={isModalOpen}
          onLogout={() => {
            setIsModalOpen(false);
            logout();
          }}
        />
      )}
    </TokenExpiredContext.Provider>
  );
};