# Debug Probe Protocol

A dependency-free CMSIS-DAP codec and reliable SWD session layer for debug probes, browser USB bridges, remote lab agents, and test fixtures.

The package implements DAP information, connect/disconnect, SWJ clock and sequence, SWD configuration, transfer configuration, single/mixed transfers, block transfers, target reset, WAIT retry handling, response validation, and a deterministic virtual probe.

## Quick start

```bash
npm install
npm test
node src/cli.js demo 731911287
```

```js
import { DapSession, Port } from '@opencircuitlabs/debug-probe-protocol';

const dap = new DapSession(hidOrUsbTransport, {
  clockHz: 1_000_000,
  waitRetries: 5
});

await dap.connect(Port.SWD);
await dap.configure({ turnaround: 1, dataPhase: false });
await dap.lineReset();
const idcode = await dap.read('dp', 0);
await dap.write('ap', 4, value);
const words = await dap.readBlock('ap', 12, 128);
await dap.disconnect();
```

## Transport boundary

A transport implements one operation:

```js
const responsePacket = await transport.exchange(requestPacket);
```

USB HID report IDs, endpoint packet sizing, and permission handling stay in the host adapter. The protocol layer validates that the response command matches the request and rejects truncated or malformed responses.

## Transfer behavior

Transfer requests support DP/AP selection, read/write direction, A2/A3 address bits, value matching, match masks, and timestamps. Status decoding exposes OK, WAIT, FAULT, protocol-error, and value-mismatch flags.

Single transfers retry only a zero-completion WAIT response, avoiding unsafe replay after partial progress. Block operations validate the completed count. Write values are bounded to unsigned 32-bit words.

## SWD setup

The session can configure clock frequency, turnaround cycles, data phase, idle cycles, WAIT retry count, and match retry count. A 64-cycle high SWJ line reset is provided before target selection. The parity helper computes ARM SWD word parity.

## Virtual probe

`VirtualDapProbe` implements the transport contract in memory, including product information, connection state, DP/AP register maps, injected WAIT responses, block operations, reset, and packet history. It supports deterministic upper-layer debugger and flashing tests without hardware.

## License

MIT
