import algosdk, { decodeAddress, Transaction } from "algosdk";
import * as fs from "fs";
import { Buffer } from "buffer";
import { getAccounts } from "./utils/sandbox";

const algod_token =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algod_host = "http://127.0.0.1";
const algod_port = "4001";

(async function () {
  // Create a client to communicate with local node
  const client = new algosdk.Algodv2(algod_token, algod_host, algod_port);

  // Get account from sandbox
  const accounts = await getAccounts();
  const acct = accounts[0];

  // Read in the local contract.json file
  const buff = fs.readFileSync("../artifacts/contract.json");

  // Parse the json file into an object, pass it to create an ABIContract object
  const contract = new algosdk.ABIContract(JSON.parse(buff.toString()));

  const appId = parseInt(fs.readFileSync("../artifacts/app_id").toString());

  // We initialize the common parameters here, they'll be passed to all the transactions
  // since they happen to be the same
  const sp = await client.getTransactionParams().do();
  const commonParams = {
    appID: appId,
    sender: acct.addr,
    suggestedParams: sp,
    signer: algosdk.makeBasicAccountTransactionSigner(acct),
  };

  const comp = new algosdk.AtomicTransactionComposer();

  // Simple ABI Calls with standard arguments, return type
  comp.addMethodCall({
    method: contract.getMethodByName("add"),
    methodArgs: [1, 10],
    ...commonParams,
  });
  // comp.addMethodCall({
  //   method: contract.getMethodByName("sub"),
  //   methodArgs: [3, 1],
  //   ...commonParams,
  // });
  // comp.addMethodCall({
  //   method: contract.getMethodByName("div"),
  //   methodArgs: [4, 2],
  //   ...commonParams,
  // });
  // comp.addMethodCall({
  //   method: contract.getMethodByName("mul"),
  //   methodArgs: [3, 3],
  //   ...commonParams,
  // });

  // // Pass in an account by address, the atc will take care of mapping this correctly
  // comp.addMethodCall({
  //   method: contract.getMethodByName("min_bal"),
  //   methodArgs: ["FHWVNNZOALOSBKYFKEUIZC56SGPLLAREZFFWLXCPBBVVISXDLPTRFR7EIQ"],
  //   ...commonParams,
  // });

  // // Dynamic argument types are supported (undefined length array)
  // comp.addMethodCall({
  //   method: contract.getMethodByName("concat_strings"),
  //   methodArgs: [["this", "string", "is", "joined"]],
  //   ...commonParams,
  // });

  // Finally, execute the composed group and print out the results
  const results = await comp.execute(client, 2);
  for (const result of results.methodResults) {
    console.log(`${result.method.name} => ${result.returnValue}`);
  }
})();
