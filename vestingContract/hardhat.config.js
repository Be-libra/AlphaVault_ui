require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_PRIVATE_KEY =
  "2346423f8bc7d2c325d262eeaf71f1e68b7c46c9a91cd3ce492483d142b92982";
// task("accounts", "Prints the list of accounts", async () => {
//   const accounts = await ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.0",
      },
      {
        version: "0.4.18",
      },
    ],
  },
  paths: {
    artifacts: './artifacts',
  },
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/bfd85273741444f4bcf93f880b9b79e0",
      accounts: [GOERLI_PRIVATE_KEY],
      confirmations: 2,
    },
  }
};

