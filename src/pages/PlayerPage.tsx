import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "../assets/PlayerPage.css";

export default function PlayerPage() {
  const { id } = useParams();
  const { state } = useLocation();
  let encryptedSumId = state;

  useEffect(() => {
    getStats();
  }, [encryptedSumId]);

  function getStats() {
    let summName: any = document.getElementById("summName");
    let rank: any = document.getElementById("rank");
    let wins: any = document.getElementById("wins");
    let losses: any = document.getElementById("losses");
    axios({
      method: "get",
      url: `/${encryptedSumId}`,
      baseURL:
        "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner",
      params: {
        api_key: process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => {
        let stats = response.data[0];
        summName.innerHTML = stats.summonerName;
        rank.innerHTML = stats.tier + " " + stats.rank;
        wins.innerHTML = stats.wins;
        losses.innerHTML = stats.losses;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="App">
      <header className="header">
        <table id="stats">
          <thead>
            <tr>
              <th>Summoner name: </th>
              <th id="summName"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Rank: </th>
              <th id="rank"></th>
            </tr>
            <tr>
              <th>Wins: </th>
              <th id="wins"></th>
            </tr>
            <tr>
              <th>Losses: </th>
              <th id="losses"></th>
            </tr>
          </tbody>
        </table>
      </header>
    </div>
  );
}
