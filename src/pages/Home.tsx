import React, { useState } from "react";
import logo from "../assets/logo.svg";
import "../assets/App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  let encryptedId = "";
  function findPlayer() {
    let playerName = input;
    axios({
      method: "get",
      url: `/${playerName}`,
      baseURL:
        "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name",
      params: {
        api_key: process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => {
        console.log(response.status);
        encryptedId = response.data.id;
      })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      navigate(`/summoners/${playerName}`, { state: encryptedId });
    }, 1000);
  }

  return (
    <div className="App">
      <header className="header">
        <h1 id="title">League Of Stats</h1>
        <div id="searchBarLayout">
          <input
            id="searchBar"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                findPlayer();
              }
            }}
          ></input>
          <div id="searchIcon" onClick={findPlayer}></div>
        </div>
      </header>
    </div>
  );
}

export default Home;
