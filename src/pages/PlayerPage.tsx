import axios from "axios";
import { stat } from "fs/promises";
import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "../assets/PlayerPage.css";

export default function PlayerPage() {
  const { id } = useParams();
  const { state }: any = useLocation();
  let encryptedSumId: string = state.id;
  let server: string = state.region;
  let puuid: string = state.puuid;
  let pfpId = state.pfpId;
  let lvl = state.lvl;
  let matchServ = servMatch(server);
  let arrayOfMatches: string[] = [];
  let statDict = {
    summonerName: "",
    solo_tier: "",
    solo_rank: "",
    solo_wins: 0,
    solo_losses: 0,
    solo_lp: 0,
    flex_tier: "",
    flex_rank: "",
    flex_wins: 0,
    flex_losses: 0,
    flex_lp: 0,
  };
  let matchDict = {
    queueId: 420,
    assists: 0,
    kda: 0,
    champLevel: 0,
    champId: 0,
    deaths: 0,
    goldEarned: 0,
    position: "0",
    item0: 0,
    item1: 0,
    item2: 0,
    item3: 0,
    item4: 0,
    item5: 0,
    item6: 0,
    kills: 0,
    multikill: 0,
    summoner1Id: 0,
    summoner2Id: 0,
    timePlayed: 0,
    dmgDealt: 0,
    dmgTaken: 0,
    vision: 0,
    win: false,
  };

  useEffect(() => {
    getStats();
    // getMatches();
    // getMatchInfo("EUW1_5970140882");
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
    axios({
      method: "get",
      url: `/${encryptedSumId}`,
      baseURL: `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner`,
      params: {
        api_key: process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => {
        let stats = response.data;
        let len = stats.length;
        statDict.summonerName = stats[0].summonerName;
        for (let i = 0; i < len; i++) {
          stats = response.data[i];
          if (stats.queueType == "RANKED_SOLO_5x5") {
            statDict.solo_wins = stats.wins;
            statDict.solo_losses = stats.losses;
            statDict.solo_lp = stats.leaguePoints;
            statDict.solo_tier = stats.tier;
            statDict.solo_rank = stats.rank;
          } else {
            statDict.flex_wins = stats.wins;
            statDict.flex_losses = stats.losses;
            statDict.flex_lp = stats.leaguePoints;
            statDict.flex_tier = stats.tier;
            statDict.flex_rank = stats.rank;
          }
          setStats();
        }
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
        matchDict.queueId = response.data.info.queueId;
        matchDict.assists = player.assists;
        matchDict.kda = player.challenges.kda;
        matchDict.champLevel = player.champLevel;
        matchDict.champId = player.championId;
        matchDict.deaths = player.deaths;
        matchDict.goldEarned = player.goldEarned;
        matchDict.position = player.individualPosition;
        matchDict.item0 = player.item0;
        matchDict.item1 = player.item1;
        matchDict.item2 = player.item2;
        matchDict.item3 = player.item3;
        matchDict.item4 = player.item4;
        matchDict.item5 = player.item5;
        matchDict.item6 = player.item6;
        matchDict.kills = player.kills;
        matchDict.multikill = player.largestMultiKill;
        matchDict.summoner1Id = player.summoner1Id;
        matchDict.summoner2Id = player.summoner2Id;
        matchDict.timePlayed = player.timePlayed;
        matchDict.dmgDealt = player.totalDamageDealtToChampions;
        matchDict.dmgTaken = player.totalDamageTaken;
        matchDict.vision = player.visionScore;
        matchDict.win = player.win;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function setStats() {
    let soloArr = document.getElementsByClassName("solo");
    let flexArr = document.getElementsByClassName("flex");
    let soloBox = document.querySelectorAll("soloRem");
    let flexBox = document.querySelectorAll(".flexRem");
    let sumName = document.getElementById("sumName");
    let level = document.getElementById("lvl");

    level!.innerHTML = `${lvl}`;
    sumName!.innerHTML = statDict.summonerName;
    let pfpic = document.getElementById("pfpic") as HTMLImageElement;
    pfpic.src = `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${pfpId}.png`;

    if (statDict.solo_losses == 0 && statDict.solo_wins == 0) {
      for (let i = 0; i < soloBox.length; i++) {
        soloBox[i].remove();
      }
      document.getElementById("solo-none")!.style.visibility = "visible";
    } else {
      let getWr = () => {
        let sum = statDict.solo_wins + statDict.solo_losses;
        return Math.floor(Math.round(100 * (statDict.solo_wins / sum)));
      };
      soloArr[1].innerHTML = statDict.solo_tier + " " + statDict.solo_rank;
      soloArr[2].innerHTML = `${statDict.solo_lp} LP`;
      soloArr[3].innerHTML = `${statDict.solo_wins}W ${statDict.solo_losses}L`;
      soloArr[4].innerHTML = `Win Rate ${getWr()}%`;
      (
        soloArr[0] as HTMLImageElement
      ).src = `${require(`../images/${statDict.solo_tier.toLowerCase()}.png`)}`;
    }

    if (statDict.flex_losses == 0 && statDict.flex_wins == 0) {
      for (let i = 0; i < flexBox.length; i++) {
        flexBox[i].remove();
      }
      document.getElementById("flex-none")!.style.visibility = "visible";
    } else {
      let getWr = () => {
        let sum = statDict.flex_wins + statDict.flex_losses;
        return Math.floor(Math.round(100 * (statDict.flex_wins / sum)));
      };
      flexArr[1].innerHTML = statDict.flex_tier + " " + statDict.flex_rank;
      flexArr[2].innerHTML = `${statDict.flex_lp} LP`;
      flexArr[3].innerHTML = `${statDict.flex_wins}W ${statDict.flex_losses}L`;
      flexArr[4].innerHTML = `Win Rate ${getWr()}%`;
      (
        flexArr[0] as HTMLImageElement
      ).src = `${require(`../images/${statDict.flex_tier.toLowerCase()}.png`)}`;
    }
  }

  return (
    <div className="App">
      <header className="header">
        <div id="main">
          <div id="statpage">
            <div id="summoner">
              <h1 id="sumName">Summoner name</h1>
              <div id="pfp">
                <img
                  id="pfpic"
                  src="http://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/588.png"
                ></img>
              </div>
              <div id="oval">
                <div id="lvl">300</div>
              </div>
            </div>
            <div id="solo">
              <img
                id="solo-img"
                className="solo soloRem"
                src={require("../images/iron.png")}
              ></img>
              <div id="solo-queue">Ranked Solo</div>
              <div id="solo-rank" className="solo soloRem">
                Iron 4
              </div>
              <div id="solo-lp" className="solo soloRem">
                15 Lp
              </div>
              <div id="solo-win-loss" className="solo soloRem">
                20W 20L
              </div>
              <div id="solo-wr" className="solo soloRem">
                Win Rate 50%
              </div>
              <div id="solo-none">NO MATCHES PLAYED</div>
            </div>
            <div id="flex">
              <img
                id="flex-img"
                className="flex flexRem"
                src={require("../images/iron.png")}
              ></img>
              <div id="flex-queue">Ranked Flex</div>
              <div id="flex-rank" className="flex flexRem">
                Iron 4
              </div>
              <div id="flex-lp" className="flex flexRem">
                15 Lp
              </div>
              <div id="flex-win-loss" className="flex flexRem">
                20W 20L
              </div>
              <div id="flex-wr" className="flex flexRem">
                Win Rate 50%
              </div>
              <div id="flex-none">NO MATCHES PLAYED</div>
            </div>
          </div>
          <div id="matches"></div>
        </div>
      </header>
    </div>
  );
}
