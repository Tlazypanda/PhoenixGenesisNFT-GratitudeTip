const main = async() => {
const [owner, superCoder] = await hre.ethers.getSigners();
    const gratitudeContractFactory = await hre.ethers.getContractFactory('GratitudeBoard');
    const gratitudeContract = await gratitudeContractFactory.deploy();
    await gratitudeContract.deployed();

    console.log("Contract deployed to:", gratitudeContract.address);
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
