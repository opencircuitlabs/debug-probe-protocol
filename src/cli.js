#!/usr/bin/env node
import { DapSession, Port, VirtualDapProbe } from './index.js';
const [command='demo',...args]=process.argv.slice(2);
try{if(command!=='demo')throw new Error('Usage: dap-tool demo [register-value]');const probe=new VirtualDapProbe();const session=new DapSession(probe);const info=await session.info(2);await session.connect(Port.SWD);await session.configure({clockHz:1_000_000});await session.lineReset();const value=Number(args[0]??0x2ba01477);await session.write('dp',0,value);const read=await session.read('dp',0);await session.disconnect();console.log(JSON.stringify({probe:info.text,written:value>>>0,read,packets:probe.packets.length},null,2));}catch(error){console.error(error.message);process.exitCode=1;}
