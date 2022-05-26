const main = async() => {
const [owner, superCoder] = await hre.ethers.getSigners();
    const nftContractFactory = await hre.ethers.getContractFactory('NFTMinter');
    const nftContract = await nftContractFactory.deploy("NFTPhoenix", "NFTP");
    await nftContract.deployed();

    /*let abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"]
    let contract = new ethers.Contract(0x0000000000000000000000000000000000001010, abi, owner)
    await contract.approve(0xAf1aa06FaBD863CFfe9D1DFcD2353C295a6484F5, 10000000)*/

    console.log("Contract deployed to:", nftContract.address);
}

const runMain = async() => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
