import { selector } from 'recoil';
import stateObjectToken from './atoms';

const stateIsRemeberToken = selector({
  key: 'stateIsRemeberToken',
  get: ({ get }) => get(stateObjectToken).isRememberToken,
  set: ({ get, set }, newValue) => {
    if (typeof newValue === 'boolean') {
      set(stateObjectToken, {
        ...get(stateObjectToken),
        isRememberToken: newValue,
      });
    }
  },
});

export default stateIsRemeberToken;
