import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import DebtHedgingChart from './DebtHedgingChart';
import { ExternalLink, FlexDivCol } from 'styles/common';
import media from 'styled-media-query';

type DebtHedgingInfoPanelProps = {
	hidden: boolean;
};

const DebtHedgingInfoPanel: React.FC<DebtHedgingInfoPanelProps> = ({ hidden }) => {
	const { t } = useTranslation();

	if (hidden) return null;
	return (
		<>
			<InfoPanelContainer>
				<InfoPanelTitle>{t('debt.actions.manage.info-panel.title')}</InfoPanelTitle>
				<InfoPanelBody>
					<Trans
						i18nKey="debt.actions.manage.info-panel.body"
						components={[
							<ExternalLink href="https://docs.dhedge.org/dhedge-original-pools/v2-snx-debt-mirror" />,
						]}
					/>
					<br />
					<StyledUniswapLinkWrapper>
						Warning: dSNX approximately hedges debt, users can incur losses. Be mindful of price
						impact and use&nbsp;
						<StyledUniswapLink href="https://info.uniswap.org/#/pools/0x9957c4795ab663622db54fc48fda874da59150ff">
							this uniswap pool&nbsp;
						</StyledUniswapLink>
						to close dSNX positions.
					</StyledUniswapLinkWrapper>
				</InfoPanelBody>
				<DebtHedgingChart />
			</InfoPanelContainer>
		</>
	);
};

const InfoPanelContainer = styled(FlexDivCol)`
	background: ${(props) => props.theme.colors.navy};
	width: 484px;
	${media.lessThan('medium')`
		width: 100%;
	`}
`;

const InfoPanelTitle = styled.p`
	padding: 30px;
	margin: 0;
	font-family: ${(props) => props.theme.fonts.condensedBold};
	color: ${(props) => props.theme.colors.white};
	font-size: 16px;
`;

const InfoPanelBody = styled.p`
	padding: 0px 30px 30px 30px;
	margin: 0;
	font-family: ${({ theme }) => theme.fonts.regular};
	color: ${({ theme }) => theme.colors.gray};
	font-size: 14px;
`;

const StyledUniswapLinkWrapper = styled.div`
	margin-top: 8px;
`;

const StyledUniswapLink = styled(ExternalLink)`
	font-size: 14px;
	align-self: flex-end;
`;

export default DebtHedgingInfoPanel;
