import { wei } from '@synthetixio/wei';
import { Synths } from 'constants/currency';
import { calculateMaxDraw, getSafeCratio } from './helpers';

describe('calculateMaxDraw', () => {
	test('eth works', () => {
		const loan = {
			collateralAsset: 'sETH',
			currency: 'sUSD',
			collateral: wei(1).toBN(),
			amount: wei(1600).toBN(),
			minCratio: wei(1.3).toBN(),
		} as any;
		const exchangeRates = {
			[Synths.sETH]: wei(3000),
			[Synths.sUSD]: wei(1),
		};
		const result = calculateMaxDraw(loan, exchangeRates);
		expect(result.toString(2)).toBe('542.86'); // 3000 / (1.3 + 0.1) - 1600
	});
	test('renBTC works', () => {
		const loan = {
			collateralAsset: 'renBTC',
			currency: 'sUSD',
			collateral: wei(1).toBN(),
			amount: wei(1600).toBN(),
			minCratio: wei(1.3).toBN(),
		} as any;
		const exchangeRates = {
			[Synths.sBTC]: wei(40000),
			[Synths.sUSD]: wei(1),
		};
		const result = calculateMaxDraw(loan, exchangeRates);
		expect(result.toString(2)).toBe('26971.43'); // 40000 / (1.3 + 0.1) - 1600
	});
	test('returns 0 if maxDraw is negative', () => {
		const loan = {
			collateralAsset: 'sETH',
			currency: 'sUSD',
			collateral: wei(1).toBN(),
			amount: wei(2500).toBN(),
			minCratio: wei(1.3).toBN(),
		} as any;
		const exchangeRates = {
			[Synths.sETH]: wei(3000),
			[Synths.sUSD]: wei(1),
		};
		const result = calculateMaxDraw(loan, exchangeRates);
		expect(result.toString(0)).toBe('0'); // 3000 / (1.3 + 0.1) - 2500 would be negative
	});
});

describe('getSafeCratio', () => {
	test('works', () => {
		const loan = { minCratio: wei(1.3) } as any;
		const result = getSafeCratio(loan);
		expect(result.toString(1)).toBe('1.4');
	});
});
