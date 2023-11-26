import { Button, Td } from "@chakra-ui/react";
import { AppraiseResult, OutputCurrency } from "@banool/aptos-account-value";

export const RowInfo = ({ result, outputCurrency }: { result: AppraiseResult | undefined, outputCurrency: OutputCurrency }) => {
  const earlyReturn = (
    <>
      <Td></Td>
      <Td></Td>
      <Td></Td>
      <Td></Td>
    </>
  );

  if (result === undefined) {
    return earlyReturn;
  }

  let prefix = "";
  let suffix = "";
  if (outputCurrency === OutputCurrency.USD) {
    prefix = "$";
  }
  if (outputCurrency === OutputCurrency.APT) {
    suffix = OutputCurrency.APT;
  }

  return (
    <>
      <Td>{`${prefix}${result.totalValue.toFixed(2)} ${suffix}`}</Td>
      <Td>{result.knownAssets.length}</Td>
      <Td>{result.unknownAssets.length}</Td>
      <Td><Button>🧐</Button></Td>
    </>
  );
};
