import Context from "https://deno.land/std@0.167.0/wasi/snapshot_preview1.ts";
import { dirname } from "https://deno.land/std@0.167.0/path/mod.ts";
import { wasmCode } from './generated/wasmCode.ts'

const paths = Deno.args
    .map(p => dirname(p))
    .filter(p => {
        try {
            Deno.statSync(p)
            return true
        } catch (_) {
            return false
        }
    })

const preopens = Object.fromEntries(paths.map((path) => [path, path]))
const context = new Context({
    args: ['jtd_codegen', ...Deno.args],
    env: Deno.env.toObject(),
    preopens,
})
const module = await WebAssembly.compile(wasmCode);
const instance = await WebAssembly.instantiate(module, {
    "wasi_snapshot_preview1": context.exports,
});
context.start(instance);
