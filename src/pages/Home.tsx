import React, { useState } from "react";
import "../assets/Home.css";
import "../assets/App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  let encryptedId = "";
  let puuid = "";

  async function findPlayer() {
    let playerName = input;
    let server = (
      document.querySelector('input[name="region"]:checked') as HTMLInputElement
    ).value;
    await axios({
      method: "get",
      url: `/${playerName}`,
      baseURL: `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name`,
      params: {
        api_key: process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => {
        console.log(response.status);
        encryptedId = response.data.id;
        puuid = response.data.puuid;
        navigate(`/summoners/${playerName}`, {
          state: { id: encryptedId, region: server, puuid: puuid },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <header className="header">
        <h1 id="title">League Of Stats</h1>
        <div id="searchBarLayout">
          <input
            id="searchBar"
            type="text"
            placeholder="Enter summoner name"
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
        <div id="regions">
          <input
            type="radio"
            id="euw"
            name="region"
            value="euw1"
            defaultChecked={true}
          ></input>
          <label>EUW</label>

          <input type="radio" id="kr" name="region" value="kr"></input>
          <label>KR</label>

          <input type="radio" id="na" name="region" value="na1"></input>
          <label>NA</label>
        </div>
      </header>
    </div>
  );
}

export default Home;
