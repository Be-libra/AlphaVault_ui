// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const ethers = require("ethers")

async function main() {
  const erc223Contract = await hre.ethers.getContractFactory("SBTERC223");
  const tokenContract = await erc223Contract.deploy(ethers.utils.parseUnits("400000000","ether"));
  await tokenContract.deployed();
  console.log("tokenContrcat deployed to:", tokenContract.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
