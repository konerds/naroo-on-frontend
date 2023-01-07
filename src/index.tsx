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
      '본 웹사이트는 크롬 브라우저에 최적화되어 있으며, 인앱 브라우저 이용 시 예기치 않은 오류가 발생할 수 있습니다',
    );
  }
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppRouterWrapper />,
);
