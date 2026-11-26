#!/usr/bin/env node
/**
 * Generate ONE entry for DONATIONS_ADMIN_USERS. Merge into its existing JSON
 * array; never overwrite the array or silently remove other administrators.
 *
 * Supply a UTF-8 password through an explicitly opened non-TTY descriptor:
 *   node scripts/donations-admin-user.mjs alice --password-fd 3 3</secure/password-file
 * FD 0 is also supported for a password-manager pipe. Never pass a password
 * through argv, environment, shell history, or an echoing terminal. One final
 * LF or CRLF is ignored. Use a private descriptor/file and a unique password.
 * stdout contains only the JSON entry; stderr contains generic failures only.
 */
import {readSync} from 'node:fs';
import {isatty} from 'node:tty';
import {randomBytes,scryptSync} from 'node:crypto';

const usage='Cannot generate administrator record. Usage: node scripts/donations-admin-user.mjs USERNAME --password-fd FD (FD 0 or 3+; non-TTY UTF-8 input; password 16–256 characters).\n';
let passwordBytes;
let derived;
try{
  const [username,option,descriptor,...extra]=process.argv.slice(2);
  if(!username||! /^[a-zA-Z0-9][a-zA-Z0-9_.@-]{0,99}$/.test(username)||option!=='--password-fd'||! /^(0|[1-9][0-9]{0,3})$/.test(descriptor||'')||extra.length)throw new Error();
  const fd=Number(descriptor);if(fd===1||fd===2||isatty(fd))throw new Error();
  // Bound reads as well as decoded characters. UTF-8 may use four bytes/code point.
  passwordBytes=Buffer.alloc(1027);let length=0;
  while(length<passwordBytes.length){const count=readSync(fd,passwordBytes,length,passwordBytes.length-length,null);if(!count)break;length+=count;}
  if(length===passwordBytes.length)throw new Error();
  const password=new TextDecoder('utf-8',{fatal:true}).decode(passwordBytes.subarray(0,length)).replace(/\r?\n$/,'');
  if(password.length<16||password.length>256||/[\r\n\0]/.test(password))throw new Error();
  const salt=randomBytes(32);derived=scryptSync(password,salt,64);
  process.stdout.write(JSON.stringify({username,salt:salt.toString('hex'),hash:derived.toString('hex')})+'\n');
}catch{
  process.stderr.write(usage);process.exitCode=1;
}finally{
  passwordBytes?.fill(0);derived?.fill(0);
}
