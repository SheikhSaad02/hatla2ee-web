'use client';
import { useGetUserData } from '@/hooks/useGetUserData';
import { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { adMetricsService } from '@/services/mertrics/adMetrics';
import { useIsMobile } from '@/providers/isMobile';
import { Modal } from '@/components/common/modal';
import FullScreen from '@/components/common/fullScreen';
import UserSignIn from '@/components/authentication/sign-in';

export const UserContext = createContext(null);

export const UserProvider = ({ initialUser, children }) => {
  const { user, setUser, loading } = useGetUserData(initialUser);

  useEffect(() => {
    adMetricsService.setUserContext(user);
  }, [user]);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [isLeadEnforcementLogin, setIsLeadEnforcementLogin] = useState(false);
  const isMob = useIsMobile() ?? false;

  const showLoginModal = useCallback((isLeadEnforcement = false) => {
    setIsLeadEnforcementLogin(isLeadEnforcement);
    setLoginModalVisible(true);
  }, []);

  const hideLoginModal = useCallback(() => {
    setLoginModalVisible(false);
    setIsLeadEnforcementLogin(false);
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, showLoginModal, hideLoginModal }}
    >
      {children}
      {isMob ? (
        <FullScreen
          isOpen={loginModalVisible}
          onClose={hideLoginModal}
          showIconClose={true}
          showHeader={false}
          contentClassName="justify-center"
        >
          <div className="w-full">
            <UserSignIn
              setVisible={setLoginModalVisible}
              isMobile={isMob}
              isModal
              isLeadEnforcement={isLeadEnforcementLogin}
            />
          </div>
        </FullScreen>
      ) : (
        <Modal
          isOpen={loginModalVisible}
          onClose={hideLoginModal}
          showIconClose={true}
          overlayClassName="pointer-events-auto"
        >
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <UserSignIn
              setVisible={setLoginModalVisible}
              isMobile={isMob}
              isModal
              isLeadEnforcement={isLeadEnforcementLogin}
            />
          </div>
        </Modal>
      )}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
