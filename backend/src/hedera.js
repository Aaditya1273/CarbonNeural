import {
  Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  Hbar,
  PrivateKey,
  AccountId,
  TokenMintTransaction,
  TransferTransaction
} from '@hashgraph/sdk';

let cachedTokenId = null;

function getClient() {
  const network = (process.env.HEDERA_NETWORK || 'testnet').toLowerCase();
  const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
  const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY);
  const client = Client[network]();
  client.setOperator(operatorId, operatorKey);
  return client;
}

export async function createTokenIfNeeded() {
  if (cachedTokenId) return cachedTokenId;
  const name = 'Carbon-Neural Credit';
  const symbol = 'CNC';
  const client = getClient();

  const tx = new TokenCreateTransaction()
    .setTokenName(name)
    .setTokenSymbol(symbol)
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(process.env.HEDERA_OPERATOR_ID)
    .setSupplyType(TokenSupplyType.Infinite)
    .setAdminKey(PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY))
    .setSupplyKey(PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY))
    .setMaxTransactionFee(new Hbar(2));

  const submit = await tx.execute(client);
  const receipt = await submit.getReceipt(client);
  cachedTokenId = receipt.tokenId.toString();
  return cachedTokenId;
}

export async function mintReductionCredits(tokenId, amount = 1, recipient) {
  const client = getClient();
  const mint = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .setAmount(amount)
    .execute(client);
  await mint.getReceipt(client);

  if (recipient) {
    const transfer = await new TransferTransaction()
      .addTokenTransfer(tokenId, process.env.HEDERA_OPERATOR_ID, -amount)
      .addTokenTransfer(tokenId, recipient, amount)
      .execute(client);
    return await transfer.getReceipt(client);
  }
  return { status: 'MINTED_TO_TREASURY' };
}
