import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "../assets/PlayerPage.css";

export default function PlayerPage() {
  const { id } = useParams();
  const { state }: any = useLocation();
  let encryptedSumId: string = state.id;
  let server: string = state.region;
  let puuid: string = state.puuid;
  let matchServ = servMatch(server);
  let arrayOfMatches: string[] = [];

  useEffect(() => {
    getStats();
    getMatches();
    getMatchInfo("EUW1_5970140882");
  }, []);

  function servMatch(serv: string) {
    if (serv == "euw1") {
      return "europe";
    } else if (serv == "na1") {
      return "americas";
    } else if (serv == "kr") {
      return "asia";
    }
  }

  function getStats() {
    let summName: any = document.getElementById("summName");
    let rank: any = document.getElementById("rank");
    let wins: any = document.getElementById("wins");
    let losses: any = document.getElementById("losses");
    axios({
      method: "get",
      url: `/${encryptedSumId}`,
      baseURL: `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner`,
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

  function getMatches() {
    axios({
      method: "get",
      baseURL: `https://${matchServ}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      params: {
        api_key: process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => {
        let arrayOfMatches = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getMatchInfo(matchId: string) {
    let matchInfo: any[] = [];
    axios({
      method: "get",
      url: `/${matchId}`,
      baseURL: `https://${matchServ}.api.riotgames.com/lol/match/v5/matches`,
      params: {
        api_key: process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => {
        let players = response.data.info.participants;
        let player = undefined;
        for (let i = 0; i < players.length; i++) {
          if (players[i].puuid == puuid) {
            player = response.data.info.participants[i];
          }
        }
        matchInfo.push(
          player.assists,
          player.challenges.kda,
          player.champLevel,
          player.championId,
          player.deaths,
          player.goldEarned,
          player.individualPosition,
          player.item0,
          player.item1,
          player.item2,
          player.item3,
          player.item4,
          player.item5,
          player.item6,
          player.kills,
          player.largestMultiKill,
          player.role,
          player.summoner1Id,
          player.summoner2Id,
          player.timePlayed,
          player.totalDamageDealtToChampions,
          player.totalDamageTaken,
          player.visionScore,
          player.win
        );
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

{
  /* <table id="stats">
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
        </table> */
}
