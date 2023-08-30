import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { IStateToken } from '../../interfaces';

const { persistAtom } = recoilPersist({
  key: 'stateToken',
  storage: localStorage,
});

const stateObjectToken = atom<IStateToken>({
  key: 'stateObjectToken',
  default: {
    token: '',
    isRememberToken: false,
  },
  effects_UNSTABLE: [persistAtom],
});

export default stateObjectToken;
