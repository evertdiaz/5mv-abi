import contract
from pyteal import *
from beaker import *

contract.HelloWorld().dump("artifacts")

account = sandbox.get_accounts().pop()

app_client = client.ApplicationClient(
  client = sandbox.get_algod_client(),
  app = contract.HelloWorld(version=6),
  signer = account.signer,
)

app_id, app_addr, txid = app_client.create()
print(
  f"""Deployed app in txid {txid}
    App ID: {app_id} 
    Address: {app_addr} 
"""
)

f = open("./artifacts/app_id", "w")
f.write(str(app_id))
f.close()