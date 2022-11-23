from pyteal import *
from beaker import *

class HelloWorld(Application):
    @external
    def hello(self, name: abi.String, *, output: abi.String):
      return output.set(Concat(Bytes("Hello, "), name.get()))

    @external
    def add(a: abi.Uint64, b: abi.Uint64, *, output: abi.Uint64) -> Expr:
      # The doc string is used in the `descr` field of the resulting Method
      """sum a and b, return the result"""
      return output.set(a.get() + b.get())

    @external
    def sub(a: abi.Uint64, b: abi.Uint64, *, output: abi.Uint64) -> Expr:
        """subtract b from a, return the result"""
        return output.set(a.get() - b.get())


    @external
    def mul(a: abi.Uint64, b: abi.Uint64, *, output: abi.Uint64) -> Expr:
        """multiply a and b, return the result"""
        return output.set(a.get() * b.get())


    @external
    def div(a: abi.Uint64, b: abi.Uint64, *, output: abi.Uint64) -> Expr:
        """divide a by b, return the result"""
        return output.set(a.get() / b.get())


    @external
    def concat_strings(b: abi.DynamicArray[abi.String], *, output: abi.String) -> Expr:
        """Accept a list of strings, return the result of concating them all"""

        idx = ScratchVar()
        buff = ScratchVar()

        init = idx.store(Int(0))
        cond = idx.load() < b.length()
        iter = idx.store(idx.load() + Int(1))
        return Seq(
            buff.store(Bytes("")),
            For(init, cond, iter).Do(
                b[idx.load()].use(lambda s: buff.store(Concat(buff.load(), s.get())))
            ),
            output.set(buff.load()),
        )

    @external
    def min_bal(acct: abi.Account, *, output: abi.Uint64):
        """Return the minimum balance for the passed account"""
        return Seq(mb := acct.params().min_balance(), output.set(mb.value()))



HelloWorld().dump("artifacts")

