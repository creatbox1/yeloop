
const connectButton = document.getElementById("connectButton");
const claimButton = document.getElementById("claimButton");
const status = document.getElementById("status");
const walletAddressSpan = document.getElementById("walletAddressSpan");
const tokenBalanceSpan = document.getElementById("tokenBalanceSpan");
const shareLink = document.getElementById("shareLink");

const tokenAddress = "0x3D378AFB7c317099B15F272327268DA9Fd749f5E";
const claimContractAddress = "0x4605b784a20Bab247b18AC4D75F4E723245Be180";

let provider, signer, tokenContract, claimContract;

connectButton.onclick = async () => {
  if (!window.ethereum) return alert("Please install MetaMask!");

  try {
    await ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    walletAddressSpan.innerText = address;

    claimContract = new ethers.Contract(claimContractAddress, claimABI, signer);
    tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);

    const [balance, decimals] = await Promise.all([
      tokenContract.balanceOf(address),
      tokenContract.decimals()
    ]);

    const readableBalance = ethers.utils.formatUnits(balance, decimals);
    tokenBalanceSpan.innerText = parseFloat(readableBalance).toFixed(2);

    status.innerText = "✅ Wallet connected. You can now claim.";
    claimButton.disabled = false;

    shareLink.href = `https://twitter.com/intent/tweet?text=I%20just%20claimed%20free%20$KINZ%20tokens%20from%20Kinzoo%20Protocol!%20Join%20here:%20https://yourusername.github.io/kinz-claim/`;

  } catch (err) {
    console.error(err);
    status.innerText = "❌ Connection failed.";
  }
};

claimButton.onclick = async () => {
  try {
    const tx = await claimContract.claim({ value: ethers.utils.parseEther("0.00008") });
    status.innerText = "⏳ Claiming...";
    await tx.wait();
    status.innerText = "🎉 Successfully claimed $KINZ tokens!";
    claimButton.disabled = true;
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Claim failed.";
  }
};

// Placeholders for ABI
const tokenABI = [];
const claimABI = [];
