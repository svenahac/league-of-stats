import { useState } from "react";
import "../assets/Home.css";
import "../assets/App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [input, setInput] = useState<string>();
  const navigate = useNavigate();

  let encryptedId: string;
  let puuid: string;
  let profilePicId: number;
  let summLvl: number;
  let arrayOfMatches: string[];
  let summName: string;

  function servMatch(serv: string): string | undefined {
    // Sets the server for finding matches
    if (serv == "euw1") {
      return "europe";
    } else if (serv == "na1") {
      return "americas";
    } else if (serv == "kr") {
      return "asia";
    }

    return undefined;
  }

  function getMatches(server: string, playerName: string) {
    // The function posts an API request to get the most recent 5 matches played, then navigates
    // to the player page
    let matchServ: string | undefined = servMatch(server);

    axios({
      method: "get",
      baseURL: `https://${matchServ}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      params: {
        count: 5,
        api_key: process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => {
        arrayOfMatches = response.data;
        navigate(`/summoners/${playerName}`, {
          // Sending variables throught state
          state: {
            id: encryptedId,
            region: server,
            puuid: puuid,
            pfpId: profilePicId,
            lvl: summLvl,
            matchArr: arrayOfMatches,
            matchServ: matchServ,
            summName: summName,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function findPlayer() {
    // Function posts an API request to get basic user info 
    let playerName: string | undefined = input;

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
        encryptedId = response.data.id;
        puuid = response.data.puuid;
        profilePicId = response.data.profileIconId;
        summLvl = response.data.summonerLevel;
        summName = response.data.name;

        if (playerName) {
          getMatches(server, playerName);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Invalid name");
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
