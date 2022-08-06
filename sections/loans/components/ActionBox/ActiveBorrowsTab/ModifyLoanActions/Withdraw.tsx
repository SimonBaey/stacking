import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { Loan } from 'containers/Loans/types';
import TransactionNotifier from 'containers/TransactionNotifier';
import { tx } from 'utils/transactions';
import Loans from 'containers/Loans';
import Wrapper from './Wrapper';
import { useRouter } from 'next/router';
import ROUTES from 'constants/routes';
import { getETHToken } from 'contracts/ethToken';
import { getRenBTCToken } from 'contracts/renBTCToken';
import { wei } from '@synthetixio/wei';

type WithdrawProps = {
	loanId: number;
	loanTypeIsETH: boolean;
	loan: Loan;
	loanContract: ethers.Contract;
};

const Withdraw: React.FC<WithdrawProps> = ({ loan, loanId, loanTypeIsETH, loanContract }) => {
	const router = useRouter();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { reloadPendingWithdrawals } = Loans.useContainer();

	const [isWorking, setIsWorking] = useState<string>('');
	const [withdrawalAmountString, setWithdrawalAmount] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [txModalOpen, setTxModalOpen] = useState<boolean>(false);

	const collateralAsset = loanTypeIsETH ? 'ETH' : 'renBTC';
	const collateralDecimals = loanTypeIsETH ? getETHToken().decimals : getRenBTCToken().decimals;

	const collateralAmount = wei(wei(loan.collateral), collateralDecimals);
	const withdrawalAmount = withdrawalAmountString
		? wei(withdrawalAmountString, collateralDecimals)
		: wei(0);

	const remainingAmount = collateralAmount.sub(withdrawalAmount);
	const remainingAmountString = ethers.utils.formatUnits(
		remainingAmount.toBN(),
		collateralDecimals
	);

	const onSetLeftColAmount = (amount: string) => {
		!amount
			? setWithdrawalAmount(null)
			: wei(amount, collateralDecimals).gt(collateralAmount)
			? onSetLeftColMaxAmount()
			: setWithdrawalAmount(amount);
	};
	const onSetLeftColMaxAmount = () =>
		setWithdrawalAmount(ethers.utils.formatUnits(collateralAmount.toBN(), collateralDecimals));

	const getTxData = useCallback(() => {
		if (!(loanContract && !withdrawalAmount.eq(0))) return null;
		return [loanContract, 'withdraw', [loanId, withdrawalAmount.toBN()]];
	}, [loanContract, loanId, withdrawalAmount]);

	const withdraw = async () => {
		try {
			setIsWorking('withdrawing');
			setTxModalOpen(true);
			await tx(() => getTxData(), {
				showErrorNotification: (e: string) => setError(e),
				showProgressNotification: (hash: string) =>
					monitorTransaction({
						txHash: hash,
						onTxConfirmed: () => {},
					}),
			});
			await reloadPendingWithdrawals();
			setIsWorking('');
			setTxModalOpen(false);
			router.push(ROUTES.Loans.List);
		} catch {
			setIsWorking('');
			setTxModalOpen(false);
		}
	};

	return (
		<Wrapper
			{...{
				getTxData,

				loan,
				loanTypeIsETH,
				showCRatio: true,

				leftColLabel: 'loans.modify-loan.withdraw.left-col-label',
				leftColAssetName: collateralAsset,
				leftColAmount: withdrawalAmountString,
				onSetLeftColAmount,
				onSetLeftColMaxAmount,

				rightColLabel: 'loans.modify-loan.withdraw.right-col-label',
				rightColAssetName: collateralAsset,
				rightColAmount: remainingAmountString,

				buttonLabel: `loans.modify-loan.withdraw.button-labels.${
					isWorking ? isWorking : 'default'
				}`,
				buttonIsDisabled: !!isWorking,
				onButtonClick: withdraw,

				error,
				setError,

				txModalOpen,
				setTxModalOpen,
			}}
		/>
	);
};

export default Withdraw;
