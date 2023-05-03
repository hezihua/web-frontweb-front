import logo from "./logo.png";
import "./App.css";
import React, { useContext } from "react";
import { Web3Context } from "./web3";


function App() {
  const { account, connectWeb3, logout, wave } = useContext(Web3Context);

  console.log(wave, 'wave')

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="ethereum_logo" />
        <div>
          {account == null ? (
            <button onClick={connectWeb3}>Connect Web3</button>
          ) : (
            <div>
              <p>Account: {account}</p>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
        <br/>
        <a
          className="App-link"
          href="https://ethereum.org/en/what-is-ethereum/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore Ethereum
        </a>
        <div onClick={()=> {
          wave();
        }}>wave me</div>
      </header>
    </div>
  );
}

export default App;
