import React, { useEffect, useState } from "react";
import './styles/App.css';
import video from './assets/random.webm';
import twitterLogo from './assets/twitter-logo.svg';
import gratitudeGif from './assets/gratitude-thankful.gif';
import myNft from './utils/MyNft.json';
import myGratitude from './utils/MyGratitude.json';
import { ethers } from "ethers";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import { NFTStorage } from 'nft.storage';
import env from "react-dotenv";
import { createAvatar } from '@dicebear/avatars';
import * as croodlestyle from '@dicebear/croodles';
import * as adventurerstyle from '@dicebear/adventurer';
import * as adventurerneutralstyle from '@dicebear/adventurer-neutral';
import * as bigsmilestyle from '@dicebear/big-smile';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


const InputUpload = styled('input')({
  display: 'none',
});


const OPENSEA_LINK = '';
const CONTRACT_ADDRESS = "0xF3777a0Cd05802E10512FbEcbC553b1bB2b1e7FB";
const GRATITUDE_CONTRACT_ADDRESS = "0x609C309BC4DE8785ca1D83D3f1076F541e40620A";
const NFT_STORAGE_KEY = env.NFT_STORAGE_KEY;

const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [mintCount, setMintCount] = useState(0);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [svg, setSvg] = useState(null);
    const [path, setPath] = useState(null);
    const [styling, setStyling] = useState('adventurerstyle');
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState('');
    const [receiver, setReceiver] = useState(null);
    const [gratitude, setGratitude] = useState(null);

    const checkIfWalletIsConnected = async() => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        let chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Connected to chain " + chainId);

        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x13881";
        if (chainId !== rinkebyChainId) {
            alert("You are not connected to the Mumbai Polygon Test Network!");
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account)

            setupEventListener();
        } else {
            console.log("No authorized account found")
        }
    }

    /*
     * Implement your connectWallet method here
     */
    const connectWallet = async() => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            let chainId = await ethereum.request({ method: 'eth_chainId' });
            console.log("Connected to chain " + chainId);

            // String, hex code of the chainId of the Rinkebey test network
            const rinkebyChainId = "0x13881";
            if (chainId !== rinkebyChainId) {
                alert("You are not connected to the Mumbai Test Network!");
            }

            /*
             * Fancy method to request access to account.
             */
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            /*
             * Boom! This should print out public address once we authorize Metamask.
             */
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);

            setupEventListener();
        } catch (error) {
            console.log(error)
        }
    }

    const setupEventListener = async() => {
        // Most of this looks the same as our function askContractToMintNft
        try {
            const { ethereum } = window;

            if (ethereum) {
                // Same stuff again
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer);

                // THIS IS THE MAGIC SAUCE.
                // This will essentially "capture" our event when our contract throws it.
                // If you're familiar with webhooks, it's very similar to that!
                connectedContract.on("NewNFTMinted", (from, tokenId) => {
                    console.log(from, tokenId.toNumber())
                    alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
                });

                console.log("Setup event listener!")

                const connectedContractGratitude = new ethers.Contract(GRATITUDE_CONTRACT_ADDRESS, myGratitude.abi, signer);

                connectedContractGratitude.on("NewGratitudeEntry", (from, to, message, amount) => {
                    alert(`Hey there! Amount ${ethers.utils.formatEther(amount.toNumber())} has been sent from ${from} to ${to}.`);
                    let gratitude = {
                      from,
                      to,
                      message,
                      amount
                    };
                    setGratitude(gratitude);
                });

                console.log("Setup Gratitude contract event listener!")

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const askContractToMintNft = async() => {


        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wallet_address = await signer.getAddress();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer);

		  const client = new NFTStorage({ token: NFT_STORAGE_KEY });
  console.log("Uploading to nft.storage...");
  const metadata = await client.store({
    name,
    description,
    image,
  });
  console.log(`Upload complete! Minting token with metadata URI: ${metadata.url}`);

  // the returned metadata.url has the IPFS URI we want to add.
  // our smart contract already prefixes URIs with "ipfs://", so we remove it before calling the `mintToken` function
  const metadataURI = metadata.url.replace(/^ipfs:\/\//, "");

                console.log("Going to pop wallet now to pay gas...")
                let nftTxn = await connectedContract.mintToken(wallet_address, metadataURI);

                console.log("Mining...please wait.")
                await nftTxn.wait();

                console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash}`);

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const askContractToEnterGratitude = async() => {


        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wallet_address = await signer.getAddress();
                const connectedContract = new ethers.Contract(GRATITUDE_CONTRACT_ADDRESS, myGratitude.abi, signer);

  // the returned metadata.url has the IPFS URI we want to add.
  // our smart contract already prefixes URIs with "ipfs://", so we remove it before calling the `mintToken` function

                console.log("Going to pop wallet now to pay gas...")
                let nftTxn = await connectedContract.createEntry(message, receiver, {
                        value: ethers.utils.parseUnits((0.001/500 * amount).toString())
                    });

                console.log("Mining...please wait.")
                await nftTxn.wait();

                console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash}`);

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const saveSvg = (svgData) => {
      var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
      var svgUrl = URL.createObjectURL(svgBlob);
      var downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download =  name + ".svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
}

    // Render Methods
    const renderNotConnectedContainer = () => ( <
        button onClick = { connectWallet }
        className = "cta-button connect-wallet-button" >
        Connect to Wallet <
        /button>
    );

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    /*
     * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
     */
    return ( <
            div className = "App" >
            <
            div className = "container" >
            <
            div className = "header-container" >
            <
            p className = "header gradient-text" > Phoenix Guild NFTs < /p> <
            p className = "sub-text" >
            Kudos for making it so far!! <
            /p><div>
            <Input className='name-container' color="secondary" placeholder="Enter a name for your NFT" onChange={e => {
      setName(e.target.value);
    }}/></div><div className='description-container'>
    <TextField  label="Description" color="secondary" focused placeholder="Enter description for NFT" onChange={e => {
      setDescription(e.target.value);
    }}/></div>
    <div>
    <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Style</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={styling}
    label="Avatar Style"
    onChange={e => {
      console.log(e.target.value);
setStyling(e.target.value);
let svg = createAvatar(e.target.value, {
  seed: name,
  // ... and other options
});
console.log(svg);
setSvg(svg);
saveSvg(svg)}}
  >
    <MenuItem value={adventurerstyle}>adventurer</MenuItem>
    <MenuItem value={bigsmilestyle}>big-smile</MenuItem>
    <MenuItem value={croodlestyle}>croodles</MenuItem>
    <MenuItem value={adventurerneutralstyle}>adventurer neutral</MenuItem>
  </Select>
</FormControl>
</div>
<div>
<CardMedia  className='video'
            component='video'
            image={video}
            autoPlay loop muted
        />
</div>
    <div className='upload-container'>
            <label htmlFor="contained-button-file">
  <InputUpload accept="image/*" id="contained-button-file" type="file" onChange={e => {
      setImage(e.target.files[0]); console.log(e.target.files[0]); alert("Uploaded " + e.target.files[0].name); }}/>
  <Button variant="contained" component="span">
    Upload
  </Button>

</label>
  </div>
{
            currentAccount === "" ? (
                renderNotConnectedContainer()
            ) : ( <
                button onClick = { askContractToMintNft }
                className = "cta-button connect-wallet-button" >
                Mint NFT <
                /button>
            )
        } <
        button href = { OPENSEA_LINK }
    className = "cta-button open-collection-button" >
        Open collection on Opensea <
        /button>  < /
    div >  <
        p className = "header gradient-text" > Phoenix Guild Gratitude Board < /p> <
        p className = "sub-text" >
        Let's be grateful to all the awesome Mentors and Cohort mates to helped to make this a wonderful and less painful experience for us!  <
        /p>
        <
        p className = "sub-text" >
        0.001 MATIC= 500 Phoenix Hearts ❤️  <
        /p><div><img
          className='gratitude-gif'
          src={gratitudeGif}
          alt="gratitude adele"
        />
        </div>
        <div>
        <Input className='name-container' color="secondary" placeholder="Enter amount in Phoenix hearts" onChange={e => {
  setAmount(e.target.value);
}}/></div>
<div>
<Input className='name-container' color="secondary" placeholder="Enter receiver address" onChange={e => {
setReceiver(e.target.value);
}}/></div>
<div>
<Input className='name-container' color="secondary" placeholder="Who is this for and why?" onChange={e => {
setMessage(e.target.value);
}}/></div>
<label className="submit-gratitude">
<Button  variant="contained" component="span" onClick={askContractToEnterGratitude}>
  Submit
</Button>
</label>
{gratitude?
(<div className='name-container'><Card sx={{ maxWidth: 345 }}>
  <CardContent>
    <Typography gutterBottom variant="h5" component="div">
      {gratitude.from} - {gratitude.to}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {gratitude.message}
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">{ethers.utils.formatEther(gratitude.amount.toNumber())} MATIC</Button>
    <Button size="small">({ethers.utils.formatEther(gratitude.amount.toNumber())*500000}) Phoenix Hearts ❤️ </Button>
  </CardActions>
</Card></div>):(<p>Where's your gratitude?</p>)}< /
    div >
    </div>
);
};

export default App;
