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
import { sum } from "../../utils";

export const Body = () => {
  const [globalState] = useGlobalState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [addresses, updateAddresses] = useState<string[]>([]);
  const [outputCurrency, setOutputCurrency] = useState(OutputCurrency.USD);

  const accountValues = useGetAccountValueMany({
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

  if (accountValues.data !== undefined) {
    console.log("blah", JSON.stringify(Array.from(accountValues.data.entries())));
  }

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
    if (accountValues.error) {
      rows.push(
        getRowFrame(
          address,
          index,
          <RowInfo
            input={{ kind: "error", error: accountValues.error }}
            outputCurrency={outputCurrency}
          />,
        ),
      );
    } else if (accountValues.isLoading || accountValues.data === undefined) {
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
      // At this point we know the address is valid so the result must be present.
      // The library returns the keys as AIP-40 compliant strings so we convert just
      // in case.
      const appraiseResult = accountValues.data.get(AccountAddress.from(address).toString())!;
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

  let grandTotal;
  if (accountValues.data === undefined) {
    grandTotal = 0;
  } else {
    grandTotal = sum(
      Array.from(accountValues.data.values()).map(
        (result) => result.totalValue,
      ),
      (a) => a,
    );
  }

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
          {/*<option value={OutputCurrency.APT}>APT</option>*/}
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
};
