const { expect } = require("chai");

describe("Bridge", () => {
  let bridgeContract;
  let provider;

  beforeEach(async () => {
    provider = waffle.provider;
    Bridge = await ethers.getContractFactory("Bridge");
    [deployer, user1, user2, user3] = await ethers.getSigners();
    bridgeContract = await Bridge.deploy();
  });

  describe("Receive and Send Test", () => {
    it("Should bridge receive ether", async () => {

      expect(await provider.getBalance(bridgeContract.address)).to.equal(0);

      await deployer.sendTransaction({
        to: bridgeContract.address,
        value: 100,
      });

      expect(await provider.getBalance(bridgeContract.address)).to.equal(100);
      expect(await bridgeContract.getTotalBalance()).to.equal(100)

      await bridgeContract.deposit({value: 100});
      expect(await provider.getBalance(bridgeContract.address)).to.equal(200);

    });

    it("Should bridge send ether via Transfer", async () => {
      await deployer.sendTransaction({
        to: bridgeContract.address,
        value: 100,
      });

      const prevBalance = await provider.getBalance(user1.address);
      await bridgeContract.sendViaTransfer(user1.address, 10);

      expect(await provider.getBalance(bridgeContract.address)).to.equal(90);
      expect(await provider.getBalance(user1.address)).to.equal(prevBalance.add(10));
    });

    it("Should bridge send ether via Send", async () => {
      await deployer.sendTransaction({
        to: bridgeContract.address,
        value: 100,
      });

      const prevBalance = await provider.getBalance(user1.address);
      await bridgeContract.sendViaSend(user1.address, 10);

      expect(await provider.getBalance(bridgeContract.address)).to.equal(90);
      expect(await provider.getBalance(user1.address)).to.equal(prevBalance.add(10));
    });

    it("Should bridge send ether via Call", async () => {
      await deployer.sendTransaction({
        to: bridgeContract.address,
        value: 100,
      });

      const prevBalance = await provider.getBalance(user1.address);
      await bridgeContract.sendViaCall(user1.address, 10);

      expect(await provider.getBalance(bridgeContract.address)).to.equal(90);
      expect(await provider.getBalance(user1.address)).to.equal(prevBalance.add(10));
    });
  });
});
