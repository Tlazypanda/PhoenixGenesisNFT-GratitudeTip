require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");


/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const API_URL = process.env.API_URL;

module.exports = {
  defaultNetwork: "mainnet",

  networks: {
    rinkeby: {
      url: API_URL,
      accounts: [PRIVATE_KEY]
    },

    mainnet: {
      url: API_URL,
      accounts: [PRIVATE_KEY]
    },
    
    mumbai: {
            url: process.env.YOUR_ALCHEMY_MUMBAI_URL,
            accounts: [process.env.PRIVATE_KEY],
        },
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },

  solidity: {
    version: "0.8.2",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },

  paths: {
    artifacts: './src/artifacts',
  }
};
