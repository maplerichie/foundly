export const ERC20_ABI = [
  "event Approval(address indexed,address indexed,uint256)",
  "event Transfer(address indexed,address indexed,uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function decreaseAllowance(address,uint256) returns (bool)",
  "function increaseAllowance(address,uint256) returns (bool)",
  "function mintTo(address)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address,uint256) returns (bool)",
  "function transferFrom(address,address,uint256) returns (bool)",
];

export const APE_ADDR = "0x10FCb2c42686abb402ee72293f6DD8a8e5d605a1";

export const FOUNDLY_ABI = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_itemId",
        type: "bytes32",
      },
    ],
    name: "cancelItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_itemId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "finder",
        type: "address",
      },
    ],
    name: "finalizeItem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_itemId",
        type: "bytes32",
      },
    ],
    name: "reportItem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "DEPOSIT_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "items",
    outputs: [
      {
        internalType: "address",
        name: "finder",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "status",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const FOUNDLY_ADDR = "0x41FcA50220B9E10179A6cB9579A1ff78337df02B";

const POLY_SCHEMA = `@public
collection Lost {
  id: string;
  publicKey: PublicKey;
  owner: User;
  finder?: User;
  tx: string;
  name: string;
  description:string;
  category:string;
  date: number;
  location: string;
  matched: User[];
  status: number; // 0 = not found, 1 = matched, 2 = returned, 3 = canceled
  
  constructor (id: string, owner: User, tx: string, name: string, description: string, category: string, date: number, location: string) {
    this.id = id;
    this.publicKey = ctx.publicKey;
    this.owner = owner;
    this.tx = tx;
    this.name = name;
    this.description = description;
    this.category = category;
    this.date = date;
    this.location = location;
    this.matched = [];
    this.status = 0;
  }

  function cancel() {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.status = 3;
  }

  function returned(finder: User) {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.status = 2;
    this.finder = finder;
  }

  function match(matcher: User) {
    this.status = 1;
    this.matched.push(matcher);
  }
  
  @index(tx, owner, finder);
}

@public
collection Found {
  id: string;
  publicKey: PublicKey;
  finder: User;
  owner?: User;
  tx: string;
  name: string;
  description:string;
  category:string;
  date: number;
  location: string;
  matched: User[];
  status: number; // 0 = found, 1 = matched, 2 = returned, 3 = canceled
  
  constructor (id: string, finder: User, tx: string, name: string, description: string, category: string, date: number, location: string) {
    this.id = id;
    this.publicKey = ctx.publicKey;
    this.finder = finder;
    this.tx = tx;
    this.name = name;
    this.description = description;
    this.category = category;
    this.date = date;
    this.location = location;
    this.matched = [];
    this.status = 0;
  }

  function cancel() {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.status = 3;
  }

  function returned(finder: User) {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.status = 2;
    this.finder = finder;
  }

  function match(matcher: User) {
    this.status = 1;
    this.matched.push(matcher);
  }
  
  @index(tx, finder, owner);
}

@public
collection User {
  id: string;
  publicKey?: PublicKey;
  ciphertext?: string;
  nonce?: string;
  name?: string; 
  bio?: string;
  twitter?: {
    id: string;
    username: string;
  };
  discord?: {
    id: string;
    username: string;
  };
  linkedin?: {
    id: string;
    username: string;
  };
  
  constructor (id: string) {
    this.id = id;
  }
  
  function init (name: string, bio: string) {
    if (this.publicKey) {
      error('Profile initiated.');
    }
    if (!ctx.publicKey) {
      error('Signature missing.');
    }
    this.name = name;
    this.bio = bio;
    this.publicKey = ctx.publicKey;
  }
  
  function setProfile (name: string, bio: string) {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.name = name;
    this.bio = bio;
  }

  function setTwitter(id: string, username: string){
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.twitter.id = id;
    this.twitter.username = username;
  }

  function setDiscord(id: string, username: string){
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.discord.id = id;
    this.discord.username = username;
  }

  function setLinkedIn(id: string, username: string){
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.linkedin.id = id;
    this.linkedin.username = username;
  }
}
`;

export enum ENV {
  PROD = "prod",
  STAGING = "staging",
  DEV = "dev",
}

export const ATST_ABI = [
  { stateMutability: "nonpayable", type: "constructor", inputs: [] },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "creator",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "about",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      { name: "key", internalType: "bytes32", type: "bytes32", indexed: true },
      { name: "val", internalType: "bytes", type: "bytes", indexed: false },
    ],
    name: "AttestationCreated",
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      {
        name: "_attestations",
        internalType: "struct AttestationStation.AttestationData[]",
        type: "tuple[]",
        components: [
          { name: "about", internalType: "address", type: "address" },
          { name: "key", internalType: "bytes32", type: "bytes32" },
          { name: "val", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "attest",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "_about", internalType: "address", type: "address" },
      { name: "_key", internalType: "bytes32", type: "bytes32" },
      { name: "_val", internalType: "bytes", type: "bytes" },
    ],
    name: "attest",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "", internalType: "address", type: "address" },
      { name: "", internalType: "address", type: "address" },
      { name: "", internalType: "bytes32", type: "bytes32" },
    ],
    name: "attestations",
    outputs: [{ name: "", internalType: "bytes", type: "bytes" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "version",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
];

export const ATST_ADDR = "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77";
