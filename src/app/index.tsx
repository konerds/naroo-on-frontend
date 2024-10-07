import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from './providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider />
  </StrictMode>,
);
