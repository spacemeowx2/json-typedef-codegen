const WASM_PATH = '../target/wasm32-wasi/release/jtd-codegen.wasm'
const OUTPUT_PATH = './generated/wasmCode.ts'

const build = Deno.run({
    cmd: ['cargo', 'build', '--target', 'wasm32-wasi', '--release', '-p', 'jtd_codegen_cli', '--target-dir', './target'],
    cwd: '..',
    stdout: 'inherit',
    stderr: 'inherit',
})

const status = await build.status()
if (!status.success) {
    Deno.exit(status.code)
}

const wasm = await Deno.readFile(WASM_PATH)
// convert to base64
const wasmString = btoa([...wasm].map(b => String.fromCharCode(b)).join(''))
const moduleCode = `const b = "${wasmString}";
export const wasmCode = new Uint8Array(atob(b).split('').map(c => c.charCodeAt(0)))`

await Deno.writeTextFile(OUTPUT_PATH, moduleCode)
