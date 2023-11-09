import React, { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
// import { BrowserView, MobileView } from 'react-device-detect';
import { CiSettings } from 'react-icons/ci';
import QnAContainer from './components/QnAContainer';
import HeadlineContainer from './components/HeadlineContainer';
import { messageIdListState } from './atoms/chatAtoms';
import SettingModal from './components/SettingModal';

const Base = styled.div`
  display: flex;
`;

const Inner = styled.div`
  width: 80%; //1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Header = styled.div`
  width: 80%; //1200px;
  position: fixed;
  top: .5rem;
  z-index: 3;
`;

const Setting = styled.div`
  position: fixed;
  top: .5rem;
  right: 1rem;
  font-size: 3rem;
  display: flex;
  justify-content: center;
`;

const LogoContainer = styled.div<{ topPos: number }>`
  position: fixed;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  -webkit-transition: all 1s;
  transition: all 1s;

  & svg {
    -webkit-transition:  width 1s, fill 1s 1s;
    transition: idth 1s, fill 1s 1s;
  }
  & p {
    -webkit-transition: all 1s;
    transition: all 1s;
  }


  &.withMsg {
    top: ${({ topPos }) => `calc(${topPos}px + 1.5rem)`};

    & svg {
      height: 9vh;
      fill: lightgray;
    }
    & p {
      opacity: 0;
    }
  }
  &.withNoMsg {
    top: 30vh;

    & svg {
      height: 13vh;
      fill: black;
    }
    & p {
      font-size: 1.5rem;
    }
  }
`;

const QnAContainerContainer = styled.div`
  width: 100%;
  height: calc(100vh - 1rem);
  position: relative;
  display: flex;
  z-index: 2;
  overflow: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ModalContainer = styled.div<{ isShown: boolean }>`
  display: ${({ isShown }) => isShown ? "block" : "none"};
  position: fixed;
  top: 0;
  z-index: 5;
`;

const Home = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [hasMessage, setHasMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messageIdList = useRecoilValue(messageIdListState); 

  const headerRef = useRef<HTMLDivElement>(null);
  const QnAContainerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [headerRef]); //헤더 높이만큼 패딩을 주기 위해서

  useEffect(() => {
    if (messageIdList.length > 0 && !hasMessage) {
      setHasMessage(true);
    }
  }, [messageIdList, hasMessage]);//메시지 유무에 따라 로고 스타일 다르게

  useEffect(() => {//질문 입력할 때마다 스크롤은 제일 아래로
    if (QnAContainerContainerRef.current) {
      QnAContainerContainerRef.current.scrollTo({top: QnAContainerContainerRef.current.scrollHeight, behavior: "smooth"});
    }
  }, [QnAContainerContainerRef, messageIdList]);

  return (
    <Base>
      <Inner>
        
        <Header ref={headerRef}>
          <HeadlineContainer />
        </Header>

        <LogoContainer 
          className={hasMessage ? "withMsg" : "withNoMsg"} 
          topPos={headerHeight}
        >
          <svg width="100%" height="100%" viewBox="0 0 189 67" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.6094 37.1279C28.8438 37.3623 29.21 37.4795 29.708 37.4795C30.2061 37.4795 30.6309 37.377 30.9824 37.1719C30.2207 32.7188 29.708 30.082 29.4443 29.2617C29.1221 28.4121 28.6387 27.9873 27.9941 27.9873C27.7012 27.9873 27.3496 28.0752 26.9395 28.251L28.6094 37.1279ZM19.9082 50.3115C19.6152 50.7217 19.4688 51.1025 19.4688 51.4541C19.4688 52.3037 20.2598 53.0215 21.8418 53.6074C23.4531 54.1641 25.4014 54.5156 27.6865 54.6621C28.0674 58.8809 28.4775 61.2832 28.917 61.8691C28.3604 62.9531 26.8223 64.0518 24.3027 65.165C21.7832 66.249 18.9414 66.791 15.7773 66.791C11.5879 66.791 7.99902 65.8975 5.01074 64.1104C2.02246 62.2939 0.52832 59.9648 0.52832 57.123C0.52832 56.3613 0.601562 55.6875 0.748047 55.1016L10.1084 13.2656C12.4521 11.7715 15.25 10.5996 18.502 9.75C21.7539 8.90039 25.1377 8.47559 28.6533 8.47559C33.6924 8.47559 37.999 9.3252 41.5732 11.0244C45.6455 12.958 48.1211 15.7559 49 19.418L59.0195 60.8584C55.9727 64.8135 51.0068 66.791 44.1221 66.791C40.7822 66.791 37.9551 66.1904 35.6406 64.9893C33.3262 63.7881 31.9785 62.0742 31.5977 59.8477L30.6309 54.4863C32.3887 54.457 34.0879 54.1201 35.7285 53.4756C37.3691 52.8311 38.1895 52.1572 38.1895 51.4541C38.1895 50.9854 37.999 50.6045 37.6182 50.3115C36.5049 51.1025 35.1426 51.7031 33.5312 52.1133C31.9199 52.5234 30.4258 52.7285 29.0488 52.7285C25.0938 52.7285 22.0469 51.9229 19.9082 50.3115ZM82.3545 26.4492V43.8516C82.3545 48.2168 83.4092 51.0586 85.5186 52.377C85.5479 52.5234 85.5625 52.8018 85.5625 53.2119V54.0029C85.5625 58.3096 84.3906 61.5469 82.0469 63.7148C79.8789 65.7656 76.9785 66.791 73.3457 66.791C69.7422 66.791 66.7686 65.7656 64.4248 63.7148C61.4658 61.1074 59.9863 57.2988 59.9863 52.2891V23.7246C60.5137 23.3438 61.085 23.0361 61.7002 22.8018C62.3154 22.5674 62.96 22.2744 63.6338 21.9229C62.374 21.2783 61.2314 20.165 60.2061 18.583C59.1807 16.9717 58.668 15.0967 58.668 12.958C58.668 9.2666 59.8838 6.24902 62.3154 3.90527C64.7471 1.56152 67.7207 0.389648 71.2363 0.389648C74.7812 0.389648 77.7402 1.59082 80.1133 3.99316C82.5156 6.36621 83.7168 9.35449 83.7168 12.958C83.7168 15.8584 82.8086 18.4072 80.9922 20.6045C79.1758 22.7725 76.9639 24.1348 74.3564 24.6914C74.3564 25.8047 74.7812 26.3613 75.6309 26.3613C77.125 26.3613 78.6484 25.7754 80.2012 24.6035C81.373 25.5117 82.0908 26.127 82.3545 26.4492ZM109.425 49.4766L107.315 50.3994C107.315 52.3623 107.696 54.457 108.458 56.6836C109.103 58.793 109.996 60.668 111.139 62.3086C108.238 65.2969 104.21 66.791 99.0537 66.791C96.0947 66.791 93.5312 66.0146 91.3633 64.4619C88.8438 62.7041 87.584 60.375 87.584 57.4746V6.19043C88.9902 5.37012 90.6748 4.69629 92.6377 4.16895C94.6299 3.6416 96.6367 3.37793 98.6582 3.37793C102.027 3.37793 104.811 4.03711 107.008 5.35547C109.498 6.9082 110.743 9.13477 110.743 12.0352V16.6934C110.743 20.5898 110.055 24.3984 108.678 28.1191C108.414 28.5 107.945 29.0566 107.271 29.7891C106.598 30.4922 106.056 31.1367 105.646 31.7227C105.265 32.3086 105.074 32.8213 105.074 33.2607C105.074 33.6709 105.426 34.0518 106.129 34.4033C108.414 32.2646 110.201 29.9355 111.49 27.416C112.809 24.8965 114.01 21.5566 115.094 17.3965C115.475 17.3379 115.914 17.2646 116.412 17.1768C116.91 17.0889 117.73 16.957 118.873 16.7812C120.045 16.5762 120.865 16.4736 121.334 16.4736C125.846 16.4736 129.361 17.5137 131.881 19.5938C134.4 21.6445 135.66 24.4717 135.66 28.0752C135.66 31.6787 134.518 34.7695 132.232 37.3477C130.123 39.6621 127.384 41.4053 124.015 42.5771C126.71 44.1592 130.108 45.2871 134.21 45.9609C135.792 48.832 136.583 51.8936 136.583 55.1455C136.583 58.3682 135.558 61.0635 133.507 63.2314C131.222 65.6045 128.058 66.791 124.015 66.791C120.001 66.791 116.69 65.2529 114.083 62.1768C111.505 59.0713 109.952 54.8379 109.425 49.4766ZM162.511 46.8398C162.862 46.8398 163.243 46.6934 163.653 46.4004C163.36 45.4336 163.214 43.9248 163.214 41.874V20.165C166.319 18.29 170.055 17.3525 174.42 17.3525C176.881 17.3525 179.034 17.6895 180.88 18.3633C182.755 19.0078 184.19 19.8721 185.187 20.9561V43.8516C185.187 48.2168 186.241 51.0586 188.351 52.377C188.38 52.5234 188.395 52.8018 188.395 53.2119V54.0029C188.395 58.2803 187.267 61.5176 185.011 63.7148C182.96 65.7656 180.133 66.791 176.529 66.791C174.273 66.791 172.223 66.2783 170.377 65.2529C168.561 64.2275 167.198 62.7334 166.29 60.7705C165.294 60.7705 164.796 61.2539 164.796 62.2207C164.796 62.8945 165.133 63.5684 165.807 64.2422C164.869 65.0039 163.741 65.6191 162.423 66.0879C161.104 66.5566 159.156 66.791 156.578 66.791C154.029 66.791 151.539 66.2637 149.107 65.209C146.09 63.9199 143.775 61.9424 142.164 59.2764C140.201 56.1123 139.22 52.0986 139.22 47.2354V36.2051C137.726 33.5977 136.979 30.7266 136.979 27.5918C136.979 25.9805 137.184 24.3105 137.594 22.582C138.004 20.8535 138.663 19.3154 139.571 17.9678H149.239C152.872 17.9678 155.714 18.832 157.765 20.5605C159.845 22.2598 160.885 24.8525 160.885 28.3389V42.5771C160.885 45.4189 161.427 46.8398 162.511 46.8398Z"  />
          </svg>

          <p>{`아이쿠! 지식 충전할 시간 :)`}</p>
        </LogoContainer>

        <QnAContainerContainer ref={QnAContainerContainerRef}>
          <QnAContainer pdTop={headerHeight} />
        </QnAContainerContainer>
                  
        <ModalContainer isShown={isModalOpen}>
          <SettingModal onClose={() => setIsModalOpen(false)} />
        </ModalContainer>
      </Inner> 

      <Setting onClick={() => setIsModalOpen(true)}>
        <CiSettings />
      </Setting>
    </Base>
  );
}

export default Home;