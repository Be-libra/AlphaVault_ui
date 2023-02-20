require("@nomicfoundation/hardhat-toolbox");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

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
        version: "0.8.13",
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
