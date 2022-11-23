const { expect, assert } = require("chai");
const { getAddress } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("formaCar tests", function () {
  let formaCar;

  this.beforeEach(async function () {
    [account1, account2] = await ethers.getSigners();
    const FormaCar = await ethers.getContractFactory("formaCar");
    formaCar = await FormaCar.deploy("tamaz", "rama", "123", account1.address);
  });
  describe("Wl mint", function () {
    it("It return wlmint close", async function () {
      assert.equal(await formaCar.wlMint(), false);
      [account1, account2] = await ethers.getSigners();
      await expect(formaCar.connect(account2).turnWlMint()).to.be.revertedWith(
        "Only owner can call this fucntion"
      );
      await formaCar.turnWlMint();
      assert.equal(await formaCar.wlMint(), true);
      await formaCar.turnWlMint();
      assert.equal(await formaCar.wlMint(), false);
    });
    it("It return wlmint open", async function () {
      await formaCar.turnWlMint();
      assert.equal(await formaCar.wlMint(), true);
    });
    it("Will be minted if address is  in wl", async function () {
      [account1, account2] = await ethers.getSigners();
      await formaCar.addMerkleRootWL(
        "0x070e8db97b197cc0e4a1790c5e6c3667bab32d733db7f815fbe84f5824c7168d"
      );
      await expect(
        formaCar
          .connect(account2)
          .mintWL([
            "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9",
          ])
      ).to.be.revertedWith("Wl mint is close");
      await formaCar.turnWlMint();
      await formaCar
        .connect(account2)
        .mintWL([
          "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9",
        ]);
      assert.equal(await formaCar.balanceOf(account2.address), 1);

      await expect(
        formaCar
          .connect(account2)
          .mintWL([
            "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9",
          ])
      ).to.be.revertedWith(
        "You have already minted max wl nft for your address"
      );
    });
    it("Will be reverted if size for wl will be reached", async function () {
      [account1, account2] = await ethers.getSigners();
      await formaCar.addMerkleRootWL(
        "0x070e8db97b197cc0e4a1790c5e6c3667bab32d733db7f815fbe84f5824c7168d"
      );
      await formaCar.turnWlMint();
      await expect(
        formaCar
          .connect(account2)
          .mintWL([
            "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9",
          ])
      ).to.be.revertedWith("Wl size was reached");
    });
  });
  describe("Public mint", function () {
    it("Will be reverted if public mint did not started, mint max per walet, not enough eth", async function () {
      [account1, account2] = await ethers.getSigners();
      await expect(formaCar.mintPublic({ value: 3 })).to.be.revertedWith(
        "Public mint didn't open"
      );
      await expect(formaCar.mintPublic({ value: 2 })).to.be.revertedWith(
        "Not enough ETH"
      );
      await formaCar.turnPublicMint();
      await formaCar.mintPublic({ value: 3 });
      await expect(formaCar.mintPublic({ value: 3 })).to.be.revertedWith(
        "You have minted max per you address"
      );
    });
    it("Will be minted if public mint started and enough eth", async function () {
      await formaCar.turnPublicMint();
      await formaCar.mintPublic({ value: 3 });
      await formaCar.connect(account2).mintPublic({ value: 3 });
      assert.equal(await formaCar.balanceOf(account1.address), 1);
      assert.equal(await formaCar.balanceOf(account2.address), 1);
    });
    it("Will be reverted if no owner try transfer", async function () {
      [account1, account2] = await ethers.getSigners();
      await formaCar.turnPublicMint();

      await formaCar.connect(account2).mintPublic({ value: 3 });
      await expect(
        formaCar
          .connect(account2)
          .transferFrom(account2.address, account1.address, 1)
      ).to.be.revertedWith("Only owner can call this fucntion");
    });
    it("Will be transferd if owner calls", async function () {
      [account1, account2] = await ethers.getSigners();
      await formaCar.turnPublicMint();

      await formaCar.mintPublic({ value: 3 });
      await formaCar.transferFrom(account1.address, account2.address, 1);
      assert.equal(await formaCar.balanceOf(account2.address), 1);
      assert.equal(await formaCar.balanceOf(account1.address), 0);
    });
  });
  describe("Tresuare mint", function () {
    it("Will be reverted if not owner", async function () {
      [account1, account2] = await ethers.getSigners();
      await expect(
        formaCar.connect(account2).tresuareMint(3)
      ).to.be.revertedWith("Only owner can call this fucntion");
    });
    it("Will be minted if call owner", async function () {
      await formaCar.tresuareMint(10);
      assert.equal(await formaCar.balanceOf(account1.address), 10);
    });
  });
  describe("Burning function", function () {
    it("Will be reverted if not owner", async function () {
      [account1, account2] = await ethers.getSigners();
      await expect(formaCar.connect(account2).burn(3)).to.be.revertedWith(
        "Only owner can call this fucntion"
      );
    });
    it("Will be burned if call owner", async function () {
      [account1, account2] = await ethers.getSigners();
      await formaCar.turnPublicMint();
      assert.equal(await formaCar.balanceOf(account1.address), 0);
      await formaCar.connect(account2).mintPublic({ value: 3 });
      assert.equal(await formaCar.balanceOf(account2.address), 1);
      await formaCar.burn(1);
      assert.equal(await formaCar.ownerOf(1), account1.address);
      assert.equal(await formaCar.balanceOf(account1.address), 1);
      assert.equal(await formaCar.balanceOf(account2.address), 0);
    });
  });
  describe("Set uri function", function () {
    it("Will reverted if not owner", async function () {
      [account1, account2] = await ethers.getSigners();
      await expect(
        formaCar.connect(account2).setURI("tamaz")
      ).to.be.revertedWith("Only owner can call this fucntion");
    });
    it("Will set uri", async function () {
      await formaCar.setURI("tamaz/");
      await formaCar.turnPublicMint();
      await formaCar.tresuareMint(10);
      assert.equal(await formaCar.tokenURI(1), "tamaz/1");
    });
  });
  describe("Owner functions", function () {
    it("Will return owner address", async function () {
      [account1, account2] = await ethers.getSigners();
      assert.equal(await formaCar.checkOwner(), account1.address);
    });
    it("Will revert if no owner trying to change", async function () {
      [account1, account2] = await ethers.getSigners();
      await expect(
        formaCar.connect(account2).changeOwner(account2.address)
      ).to.be.revertedWith("Only owner can call this fucntion");
    });
    it("Will change owner address", async function () {
      [account1, account2] = await ethers.getSigners();
      await formaCar.changeOwner(account2.address);
      assert.equal(await formaCar.checkOwner(), account2.address);
    });
  });
});
