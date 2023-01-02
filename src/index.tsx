import * as ReactDOM from 'react-dom/client';
import './index.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AppRouterWrapper from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppRouterWrapper />,
);
