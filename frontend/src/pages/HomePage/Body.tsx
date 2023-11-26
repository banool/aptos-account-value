import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Tooltip,
  Text,
  Button,
  Td,
  Input,
  Link,
  Flex,
  Card,
  CardBody,
  CardHeader,
  Center,
  CardFooter,
  Heading,
  Spacer,
  useToast,
  Select,
  Divider,
} from "@chakra-ui/react";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGlobalState } from "../../context/GlobalState";
import { RowInfo, formatAmount } from "./RowInfo";
import { OutputCurrency } from "@banool/aptos-account-value";
import { useGetAccountValueMany } from "../../api/hooks/useGetAccountValueMany";
import { AccountAddress } from "@aptos-labs/ts-sdk";

export const Body = () => {
  const [globalState] = useGlobalState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [addresses, updateAddresses] = useState<string[]>([]);
  const [outputCurrency, setOutputCurrency] = useState(OutputCurrency.USD);

  const queries = useGetAccountValueMany({
    client: globalState.client,
    accountAddresses: addresses,
    outputCurrency,
  });

  const updateAddressesWrapper = useCallback(
    (newAddresses: string[]) => {
      updateAddresses(newAddresses);
      let paramUpdate: any = {};
      if (newAddresses.length > 0) {
        paramUpdate.addresses = newAddresses.join(",");
      }
      setSearchParams((prev) => {
        return { ...prev, ...paramUpdate };
      });
    },
    [setSearchParams],
  );

  // Set the addresses based on the query params.
  useEffect(() => {
    const addressesRaw = searchParams.get("addresses");
    if (addressesRaw) {
      updateAddressesWrapper(addressesRaw.split(","));
    }
  }, [searchParams, updateAddressesWrapper]);

  const handleOnInputPaste = (event: any) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text/plain");
    const newAddresses = pasted.split(/[\s,\n]+/);
    updateAddressesWrapper(newAddresses);
  };

  const getRowFrame = (
    address: string,
    index: number,
    tdElements: ReactNode,
  ) => {
    const onPaste = index === 0 ? handleOnInputPaste : undefined;
    return (
      <Tr key={index}>
        <Td w="1px">
          <Input
            value={address}
            minW="675px"
            onPaste={onPaste}
            onChange={(event) => {
              let newAddresses = [...addresses];
              // Handle removing an item if the address is changed to an empty string.
              if (event.target.value === "") {
                newAddresses.splice(index, 1);
              } else {
                newAddresses[index] = event.target.value;
              }
              updateAddressesWrapper(newAddresses);
            }}
            placeholder="0x96daeefd..."
          />
        </Td>
        {tdElements}
      </Tr>
    );
  };

  // Create rows for each address.
  let rows = [];
  for (const [index, address] of addresses.entries()) {
    if (address === "") {
      continue;
    }
    const validityResult = AccountAddress.isValid({ input: address });
    if (!validityResult.valid) {
      rows.push(
        getRowFrame(
          address,
          index,
          <RowInfo
            input={{
              kind: "invalid",
              reason: validityResult.invalidReasonMessage!,
            }}
            outputCurrency={outputCurrency}
          />,
        ),
      );
      continue;
    }
    const query = queries[index];
    if (query.error) {
      rows.push(
        getRowFrame(
          address,
          index,
          <RowInfo
            input={{ kind: "error", error: query.error }}
            outputCurrency={outputCurrency}
          />,
        ),
      );
    } else if (query.isLoading || query.data === undefined) {
      rows.push(
        getRowFrame(
          address,
          index,
          <RowInfo
            input={{ kind: "loading" }}
            outputCurrency={outputCurrency}
          />,
        ),
      );
    } else {
      const appraiseResult = queries[index].data!;
      rows.push(
        getRowFrame(
          address,
          index,
          <RowInfo
            input={{ kind: "present", result: appraiseResult }}
            outputCurrency={outputCurrency}
          />,
        ),
      );
    }
  }

  // Create an additional row for further input.
  rows.push(
    getRowFrame(
      "",
      addresses.length,
      <RowInfo input={{ kind: "empty" }} outputCurrency={outputCurrency} />,
    ),
  );

  const clearButton = (
    <Button
      onClick={() => {
        updateAddressesWrapper([]);
      }}
      disabled={addresses.length === 0}
    >
      Clear Addresses
    </Button>
  );

  const grandTotal = queries.reduce((acc, query) => {
    if (query.error || query.isLoading || query.data === undefined) {
      return acc;
    }
    return acc + query.data!.totalValue;
  }, 0);

  const summaryRow = (
    <Tr key={"summaryRow"}>
      <Td>Grand Total</Td>
      <Td>{formatAmount(grandTotal, outputCurrency)}</Td>
      <Td></Td>
      <Td></Td>
      <Td></Td>
    </Tr>
  );

  rows.push(summaryRow);

  return (
    <Box>
      <Flex p={2} alignContent="center">
        <Spacer />
        <Select
          w="10%"
          id="output-currency"
          value={outputCurrency}
          onChange={(e) => setOutputCurrency(e.target.value as OutputCurrency)}
        >
          <option value={OutputCurrency.USD}>USD</option>
          <option value={OutputCurrency.APT}>APT</option>
        </Select>
        <Box w="1%" />
        {clearButton}
        <Spacer />
      </Flex>
      <TableContainer p={4} w="100%">
        <Table
          variant="simple"
          // This makes the border for the last row thicker.
          sx={{
            "& tr:nth-last-of-type(2) td": {
              borderBottomWidth: "3px",
            },
          }}
        >
          <Thead>
            <Tr>
              <Th>Addresses</Th>
              <Th>
                Total Value{" "}
                <Tooltip
                  label={`The total value of the account in ${outputCurrency}.`}
                  placement="auto"
                >
                  ⓘ
                </Tooltip>
              </Th>
              <Th>
                Known Assets{" "}
                <Tooltip
                  label="The number of assets for which we could determine the value."
                  placement="auto"
                >
                  ⓘ
                </Tooltip>
              </Th>
              <Th>
                Unknown Assets{" "}
                <Tooltip
                  label="The number of assets for which we could not determine the value."
                  placement="auto"
                >
                  ⓘ
                </Tooltip>
              </Th>
              <Th>Details</Th>
            </Tr>
          </Thead>
          <Tbody>
            <>{rows}</>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
  /*
      <Box w="100%">
        <Center>
          <Flex>
            {vestCard}
            {unlockRewardsCard}
            {distributeCard}
          </Flex>
        </Center>
      </Box>
      */
};

/*
type ButtonCardProps = {
  header: string;
  explanation: string;
  canCallStatus: CanCallStatus;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const getButtonCard = ({
  header,
  explanation,
  canCallStatus,
  onClick,
}: ButtonCardProps) => {
  let headerText;
  switch (canCallStatus) {
    case "canCall":
      headerText = "✅";
      break;
    case "cannotCall":
      headerText = "❌";
      break;
    case "loading":
      headerText = "⏳";
      break;
  }
  return (
    <Card margin={3} minW="350px" maxW="350px">
      <CardHeader>
        <Flex>
          <Heading size="md">{header}</Heading>
          <Spacer />
          <Text>{headerText}</Text>
        </Flex>
      </CardHeader>
      <CardBody>{explanation}</CardBody>
      <CardFooter>
        <Button onClick={onClick} disabled={canCallStatus !== "canCall"}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};
*/
