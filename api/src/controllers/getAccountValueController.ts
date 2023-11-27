import { Route, Controller, Post, Body } from "tsoa";
import {
  AppraiseResult,
  getAccountValueMany,
  OutputCurrency,
} from "@banool/aptos-account-value";
import {
  Aptos,
  AptosConfig,
  Network,
} from "@aptos-labs/ts-sdk";

interface GetAccountValueManyBody {
  network: Network;
  accountAddresses: string[];
  outputCurrency?: OutputCurrency;
}

@Route("accounts")
export class AccountController extends Controller {
  @Post("value")
  public async getAccountValueMany(
    @Body() body: GetAccountValueManyBody,
  ): Promise<Record<string, AppraiseResult>> {
    const config = new AptosConfig({ network: body.network });
    const client = new Aptos(config);
    return Object.fromEntries(
      (
        await getAccountValueMany({
          client,
          accountAddresses: body.accountAddresses,
          outputCurrency: body.outputCurrency || OutputCurrency.USD,
        })
      ).entries(),
    );
  }
}
