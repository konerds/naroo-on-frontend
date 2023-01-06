import * as ReactDOM from 'react-dom/client';
import './index.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AppRouterWrapper from './App';

window.onload = function () {
  if (
    navigator.userAgent.match(
      /inapp|NAVER|KAKAOTALK|Snapchat|Line|WirtschaftsWoche|Thunderbird|Instagram|everytimeApp|WhatsApp|Electron|wadiz|AliApp|zumapp|iPhone(.*)Whale|Android(.*)Whale|kakaostory|band|twitter|DaumApps|DaumDevice\/mobile|FB_IAB|FB4A|FBAN|FBIOS|FBSS|SamsungBrowser\/[^1]/i,
    )
  ) {
    alert(
      '인앱 브라우저는 지원되지 않으며, 크롬 브라우저로 실행을 권장드립니다!',
    );
    window.close();
  } else {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <AppRouterWrapper />,
    );
  }
};
