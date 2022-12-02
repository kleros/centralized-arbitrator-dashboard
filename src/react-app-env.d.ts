/// <reference types="react-scripts" />

interface Window {
  ethereum: any
  web3: any
}

interface Mime {
  lookup(filenameOrExt: string): string | false;
}

declare module "@kleros/archon"