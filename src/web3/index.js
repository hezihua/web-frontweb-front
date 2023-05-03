import { createContext, useCallback, useReducer, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import abi from "../utils/Lock.json";

import { Web3Reducer } from "./reducer";
console.log(ethers, 'ethers')
const initialState = {
  loading: false,
  account: null,
  provider: null,
};

const providerOptions = {};

const web3Modal = new Web3Modal({
  providerOptions: providerOptions,
});


const contractAddress = "0x0852D0DaB5A422C9cef0fa1D426d3AF6594C0a77";
const contractABI = abi.abi;

export const Web3Context = createContext(initialState);

export const Web3Provider = ({ children }) => {
  const [state, dispatch] = useReducer(Web3Reducer, initialState);

  const setAccount = (account) => {
    dispatch({
      type: "SET_ACCOUNT",
      payload: account,
    });
  };

  const setProvider = (provider) => {
    dispatch({
      type: "SET_PROVIDER",
      payload: provider,
    });
  };

  const logout = () => {
    setAccount(null);
    setProvider(null);
    localStorage.setItem("defaultWallet", null);
  };

  const connectWeb3 = useCallback(async () => {
    const provider = await web3Modal.connect();
    console.info(ethers, 'ethers')
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    window.web3 = ethersProvider;

    setProvider(ethersProvider);

    const signer = await ethersProvider.getSigner();
    let account = await signer.getAddress();
    setAccount(account);

    provider.on("chainChanged", () => {
      window.location.reload();
    });

    provider.on("accountsChanged", () => {
      window.location.reload();
    });
  }, []);

  const wave = async () => {
    try {
      const { ethereum } = window;
      console.log(ethereum, 'ethereum')
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log(wavePortalContract.wave,'wavePortalContract.getTotalWaves')
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toString());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}

  useEffect(() => {}, []);

  return (
    <Web3Context.Provider
      value={{
        ...state,
        connectWeb3,
        logout,
        wave,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
