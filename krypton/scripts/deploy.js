const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  const Krypton = await hre.ethers.getContractFactory("Krypton");
  const krypton = await Krypton.deploy(deployer.address);

  await krypton.waitForDeployment();

  console.log("My NFT deployed to:", await krypton.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
