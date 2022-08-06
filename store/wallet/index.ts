import {
	NetworkId,
	NetworkIdByName,
	NetworkName,
	NetworkNameById,
} from '@synthetixio/contracts-interface';
import { GasSpeed } from '@synthetixio/queries';
import { atom, selector } from 'recoil';

import { truncateAddress } from 'utils/formatters/string';
import { getWalletKey } from '../utils';

import { DelegationWallet } from '@synthetixio/queries';

export type Network = {
	id: NetworkId;
	name: NetworkName;
	useOvm: boolean;
};

export const networkState = atom<Network | null>({
	key: getWalletKey('network'),
	default: { id: NetworkIdByName.mainnet, name: NetworkNameById[1], useOvm: false },
});

export const isL2State = selector<boolean>({
	key: getWalletKey('isL2'),
	get: ({ get }) => {
		return get(networkState)?.useOvm ?? false;
	},
});

export const isMainnetState = selector<boolean>({
	key: getWalletKey('isMainnet'),
	get: ({ get }) => get(networkState)?.id === NetworkIdByName.mainnet,
});

export const isL2MainnetState = selector<boolean>({
	key: getWalletKey('isL2Mainnet'),
	get: ({ get }) => get(networkState)?.id === NetworkIdByName['mainnet-ovm'],
});

export const walletAddressState = atom<string | null>({
	key: getWalletKey('walletAddress'),
	default: null,
});

export const ensNameState = atom<string | null>({
	key: getWalletKey('ensName'),
	default: null,
});

export const ensAvatarState = atom<string | null>({
	key: getWalletKey('ensAvatar'),
	default: null,
});

export const walletWatchedState = atom<string | null>({
	key: getWalletKey('walletWatched'),
	default: null,
});

export const isWalletConnectedState = selector<boolean>({
	key: getWalletKey('isWalletConnected'),
	get: ({ get }) => get(walletAddressState) != null,
});

export const truncatedWalletAddressState = selector<string | null>({
	key: getWalletKey('truncatedWalletAddress'),
	get: ({ get }) => {
		const walletAddress = get(walletAddressState);
		if (walletAddress != null) {
			return truncateAddress(walletAddress);
		}
		return walletAddress;
	},
});

export const gasSpeedState = atom<GasSpeed>({
	key: getWalletKey('gasSpeed'),
	default: 'fast',
});

export const isEOAWalletState = atom<boolean>({
	key: getWalletKey('isEOAWallet'),
	default: false,
});

export const delegateWalletState = atom<DelegationWallet | null>({
	key: getWalletKey('delegateWallet'),
	default: null,
});
