const { ethers } = require("hardhat");


const waitChangeBalance = async (prev, address, timeout=10) => {
  const provider = await ethers.provider;
  let seconds = 0;
  let post = await provider.getBalance(address);
  while (prev.eq(post)) {
    if (seconds > timeout) {
      throw new Error(`timeout(${timeout}s): bridge can not receive value`);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    seconds++
    post = await provider.getBalance(address);
  }
};

async function main() {
  const provider = await ethers.provider;
  const [deployer] = await ethers.getSigners();
  const Bridge = await ethers.getContractFactory("Bridge");

  const bridgeContract = await Bridge.deploy();
  console.log(`Deployed Bridge Contract: ${bridgeContract.address}`);
  console.log(`Deployer balance: ${ethers.utils.formatEther(await provider.getBalance(deployer.address))}`);
  console.log(`Bridge balance: ${ethers.utils.formatEther(await provider.getBalance(bridgeContract.address))}\n`);

  let prevBalance;
  let tx;
  let receipt;


  prevBalance = await provider.getBalance(bridgeContract.address);

  console.log('Sending 10ETH to Bridge....');
  tx = await deployer.sendTransaction({
    to: bridgeContract.address,
    value: ethers.utils.parseEther("10"),
    gasLimit: 1500000,
    gasPrice: 0
  });
  console.log(`TX Hash: ${tx.hash}`);
  receipt = await tx.wait();
  console.log(`Receipt Status: ${receipt.status}`);

  await waitChangeBalance(prevBalance, bridgeContract.address);
  console.log(`[Done] Bridge balance: ${ethers.utils.formatEther(await provider.getBalance(bridgeContract.address))}\n`);

  // test sendViaTransfer
  prevBalance = await provider.getBalance(bridgeContract.address);
  console.log('Sending 1ETH from Bridge using Transfer....');
  tx = await bridgeContract.sendViaTransfer(
    deployer.address,
    ethers.utils.parseEther("1"),
    {
      value: 0,
      gasLimit: 1500000,
      gasPrice: 0
    });
  console.log(`TX Hash: ${tx.hash}`);
  receipt = await tx.wait();
  console.log(`Receipt Status: ${receipt.status}`);

  await waitChangeBalance(prevBalance, bridgeContract.address);
  console.log(`[Done] Bridge balance: ${ethers.utils.formatEther(await provider.getBalance(bridgeContract.address))}\n`);

  // test sendViaSend
  // prevBalance = await provider.getBalance(bridgeContract.address);
  // console.log('Sending 1ETH to deployer using Send....');
  // tx = await bridgeContract.sendViaSend(
  //   deployer.address,
  //   ethers.utils.parseEther("1"),
  //   {
  //     value: 0,
  //     gasLimit: 1500000,
  //     gasPrice: 0
  //   });
  // console.log(`TX Hash: ${tx.hash}`);
  // receipt = await tx.wait();
  // console.log(`Receipt Status: ${receipt.status}`);
  // await waitChangeBalance(prevBalance, bridgeContract.address, 30);
  // console.log(`[Done] Bridge balance: ${ethers.utils.formatEther(await provider.getBalance(bridgeContract.address))}\n`);

  // test sendViaCall
  // prevBalance = await provider.getBalance(bridgeContract.address);
  // console.log('Sending 1ETH to deployer using Call....');
  // tx = await bridgeContract.sendViaCall(
  //   deployer.address,
  //   ethers.utils.parseEther("1"),
  //   {
  //     value: 0,
  //     gasLimit: 1500000,
  //     gasPrice: 0
  //   });
  // console.log(`TX Hash: ${tx.hash}`);
  // receipt = await tx.wait();
  // console.log(`Receipt Status: ${receipt.status}`);
  // await waitChangeBalance(prevBalance, bridgeContract.address, 30);
  // console.log(`[Done] Bridge balance: ${ethers.utils.formatEther(await provider.getBalance(bridgeContract.address))}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
