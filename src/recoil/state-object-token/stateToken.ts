import { selector } from 'recoil';
import stateObjectToken from './atoms';

const stateToken = selector({
  key: 'stateToken',
  get: ({ get }) => get(stateObjectToken).token,
  set: ({ get, set }, newValue) => {
    if (typeof newValue === 'string') {
      set(stateObjectToken, { ...get(stateObjectToken), token: newValue });
    }
  },
});

export default stateToken;
