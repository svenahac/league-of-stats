import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HashLoader } from "react-spinners";
import "../assets/PlayerPage.css";

interface MatchInfo {
  matchId: string;
  matchEndTime: number;
  participants: string[];
  queueId: number;
  assists: number;
  kda: number;
  champLevel: number;
  champName: string;
  deaths: number;
  goldEarned: number;
  position: string;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  kills: number;
  multikill: number;
  summoner1Id: number;
  summoner2Id: number;
  timePlayed: number;
  dmgDealt: number;
  dmgTaken: number;
  vision: number;
  win: boolean;
}

interface StatDictionary {
  tier: string;
  rank: string;
  wins: number;
  losses: number;
  lp: number;
}

function getWinRate(wins: number, losses: number): number {
  const sum = wins + losses;
  return Math.floor(Math.round(100 * (wins / sum)));
}

export default function PlayerPage() {
  const { state }: any = useLocation();

  const [matchDicts, setMatchDicts] = useState<MatchInfo[]>([]);

  const [summonerName, setSummonerName] = useState<string>();

  const [statDictSolo, setStatDictSolo] = useState<StatDictionary | undefined>(
    undefined
  );
  const [statDictFlex, setStatDictFlex] = useState<StatDictionary | undefined>(
    undefined
  );

  const [loading, setLoading] = useState<boolean>(true);

  let encryptedSumId: string = state.id;
  let server: string = state.region;
  let puuid: string = state.puuid;
  let pfpId = state.pfpId;
  let lvl = state.lvl;
  let arrayOfMatches = state.matchArr;
  let matchServ: string | undefined = state.matchServ;

  useEffect(() => {
    getStats();
    getMatches();
  }, []);

  function getMatches() {
    const temp = matchDicts;
    let tempPlay: string[] = [];

    arrayOfMatches.forEach(async (match: string) => {
      try {
        const response = await axios.get(
          `https://${matchServ}.api.riotgames.com/lol/match/v5/matches/${match}`,
          {
            params: {
              api_key: process.env.REACT_APP_API_KEY,
            },
          }
        );

        let players = response.data.info.participants;
        let player;
        for (let i = 0; i < players.length; i++) {
          if (players[i].puuid == puuid) {
            player = response.data.info.participants[i];
          }
        }

        players.forEach((tmp: any) => {
          tempPlay.push(tmp.summonerName);
        });
        temp.push({
          matchId: response.data.metadata.matchId,
          matchEndTime: response.data.info.gameEndTimestamp,
          participants: tempPlay,
          queueId: response.data.info.queueId,
          assists: player.assists,
          kda: player.challenges.kda,
          champLevel: player.champLevel,
          champName: player.championName,
          deaths: player.deaths,
          goldEarned: player.goldEarned,
          position: player.individualPosition,
          item0: player.item0,
          item1: player.item1,
          item2: player.item2,
          item3: player.item3,
          item4: player.item4,
          item5: player.item5,
          item6: player.item6,
          kills: player.kills,
          multikill: player.largestMultiKill,
          summoner1Id: player.summoner1Id,
          summoner2Id: player.summoner2Id,
          timePlayed: player.timePlayed,
          dmgDealt: player.totalDamageDealtToChampions,
          dmgTaken: player.totalDamageTaken,
          vision: player.visionScore,
          win: player.win,
        });
        tempPlay = [];
        setMatchDicts(temp);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error: any) {
        console.log(error);
      }
    });
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
        setSummonerName(stats[0].summonerName);
        for (let i = 0; i < len; i++) {
          stats = response.data[i];
          if (stats.queueType == "RANKED_SOLO_5x5") {
            setStatDictSolo({
              wins: stats.wins,
              losses: stats.losses,
              lp: stats.leaguePoints,
              tier: stats.tier,
              rank: stats.rank,
            });
          } else {
            setStatDictFlex({
              wins: stats.wins,
              losses: stats.losses,
              lp: stats.leaguePoints,
              tier: stats.tier,
              rank: stats.rank,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function Match(props: any) {
    const match: MatchInfo = props.match;
    let summonerArr = match.participants;
    let position: number;

    switch (match.matchId) {
      case arrayOfMatches[0]:
        position = 1;
        break;
      case arrayOfMatches[1]:
        position = 2;
        break;
      case arrayOfMatches[2]:
        position = 3;
        break;
      case arrayOfMatches[3]:
        position = 4;
        break;
      case arrayOfMatches[4]:
        position = 5;
        break;
      default:
        position = 1;
    }

    switch (match.position) {
      case "Invalid":
        match.position = "";
        break;
      case "JUNGLE":
        match.position = "JNG";
        break;
      case "MIDDLE":
        match.position = "MID";
        break;
      case "BOTTOM":
        match.position = "BOT";
        break;
      case "UTILITY":
        match.position = "SUP";
        break;
    }
    let matchType: string;
    switch (match.queueId) {
      case 420:
        matchType = "Ranked Solo";
        break;
      case 440:
        matchType = "Ranked Flex";
        break;
      case 450:
        matchType = "ARAM";
        break;
      case 700:
        matchType = "Clash";
        break;
      default:
        matchType = "Normal";
    }

    let color1 = "white";
    let color2: string;
    if (match.win) {
      color1 = "#87cefa";
      color2 = "#269ce6";
    } else {
      color1 = "#eb4646";
      color2 = "#f81c1c";
    }

    const minutes = Math.floor(match.timePlayed / 60);
    const seconds = match.timePlayed - minutes * 60;

    const oneDay = 1000 * 60 * 60 * 24;
    const dateRoot = new Date(match.matchEndTime);
    const dateNow = new Date(Date.now());
    const time = dateNow.getTime() - dateRoot.getTime();
    const diffInDays = Math.round(time / oneDay);
    const diffInHours = Math.round(time / (oneDay / 24));
    let hours = "hour";
    let days = "day";

    if (diffInDays > 1) {
      days = "days";
    }

    if (diffInHours > 1) {
      hours = "hours";
    }

    return (
      <div
        className="match"
        style={{ backgroundColor: `${color1}`, order: `${position}` }}
      >
        <div className="big-right-angle"></div>
        <div className="small-right-angle"></div>
        <div className="line"></div>
        <div className="vertical-line"></div>
        <div className="bottom-line"></div>
        <div
          className="matchRes"
          style={{ backgroundColor: `${color2}` }}
        ></div>
        <div className="lvlBox">
          <div className="level">{match.champLevel}</div>
        </div>
        <div className="champIcon">
          <img
            src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${match.champName}.png`}
          ></img>
        </div>
        <div className="score">{`${match.kills}/${match.deaths}/${match.assists}`}</div>
        <div className="kda">{`KDA: ${match.kda.toFixed(2)}`}</div>
        <div className="role">{match.position}</div>
        <div className="gametime">{`${minutes}m ${seconds}s`}</div>
        <div className="summoner1 items">
          <img src="http://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerFlash.png"></img>
        </div>
        <div className="summoner2 items">
          <img src="http://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerExhaust.png"></img>
        </div>
        <div className="item0 items">
          {match.item0 != 0 ? (
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${match.item0}.png`}
            ></img>
          ) : (
            <></>
          )}
        </div>
        <div className="item1 items">
          {match.item1 != 0 ? (
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${match.item1}.png`}
            ></img>
          ) : (
            <></>
          )}
        </div>
        <div className="item2 items">
          {match.item2 != 0 ? (
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${match.item2}.png`}
            ></img>
          ) : (
            <></>
          )}
        </div>
        <div className="item3 items">
          {match.item3 != 0 ? (
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${match.item3}.png`}
            ></img>
          ) : (
            <></>
          )}
        </div>
        <div className="item4 items">
          {match.item4 != 0 ? (
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${match.item4}.png`}
            ></img>
          ) : (
            <></>
          )}
        </div>
        <div className="item5 items">
          {match.item5 != 0 ? (
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${match.item5}.png`}
            ></img>
          ) : (
            <></>
          )}
        </div>
        <div className="item6 items">
          {match.item6 != 0 ? (
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${match.item6}.png`}
            ></img>
          ) : (
            <></>
          )}
        </div>
        <div className="queue-type">{matchType}</div>
        <div className="match-end">
          {diffInHours <= 24
            ? `${diffInHours} ${hours} ago`
            : `${diffInDays} ${days} ago`}
        </div>
        <div className="dmg-dealt num-stat">{`Damage Dealt: ${match.dmgDealt}`}</div>
        <div className="dmg-taken num-stat">{`Damage Taken: ${match.dmgTaken}`}</div>
        <div className="gold num-stat">{`Gold Earned: ${match.goldEarned}`}</div>
        <div className="vision num-stat">{`Vision: ${match.vision}`}</div>
        <div className="part-box">
          <div className="team1">
            <ul>
              <li>
                <a>{summonerArr[0]}</a>
              </li>
              <li>
                <a>{summonerArr[1]}</a>
              </li>
              <li>
                <a>{summonerArr[2]}</a>
              </li>
              <li>
                <a>{summonerArr[3]}</a>
              </li>
              <li>
                <a>{summonerArr[4]}</a>
              </li>
            </ul>
          </div>
          <div className="team2">
            <ul>
              <li>
                <a>{summonerArr[5]}</a>
              </li>
              <li>
                <a>{summonerArr[6]}</a>
              </li>
              <li>
                <a>{summonerArr[7]}</a>
              </li>
              <li>
                <a>{summonerArr[8]}</a>
              </li>
              <li>
                <a>{summonerArr[9]}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  function renderMatches() {
    if (loading) {
      return (
        <div className="loader">
          <HashLoader size={150} color="white" loading={true} />
        </div>
      );
    }

    return matchDicts
      .slice(0, 5)
      .map((matchDict: MatchInfo) => (
        <Match
          match={matchDict}
          key={`${matchDict.dmgDealt}-${matchDict.dmgTaken}-${matchDict.goldEarned}-${summonerName}`}
        />
      ));
  }

  return (
    <div className="App">
      <header className="header">
        <div id="main">
          <div id="statpage">
            <div id="summoner">
              <h1 id="sumName">{summonerName}</h1>
              <div id="pfp">
                <img
                  id="pfpic"
                  src={`http://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${pfpId}.png`}
                ></img>
              </div>
              <div id="oval">
                <div id="lvl">{lvl}</div>
              </div>
            </div>
            {statDictSolo !== undefined ? (
              <div id="solo">
                <img
                  id="solo-img"
                  className="solo soloRem"
                  src={require(`../images/${statDictSolo.tier.toLowerCase()}.png`)}
                ></img>
                <div id="solo-queue">Ranked Solo</div>
                <div id="solo-rank" className="solo soloRem">
                  {`${statDictSolo.tier} ${statDictSolo.rank}`}
                </div>
                <div id="solo-lp" className="solo soloRem">
                  {`${statDictSolo.lp} Lp`}
                </div>
                <div id="solo-win-loss" className="solo soloRem">
                  {`${statDictSolo.wins}W ${statDictSolo.losses}L`}
                </div>
                <div id="solo-wr" className="solo soloRem">
                  {`Win Rate: ${getWinRate(
                    statDictSolo.wins,
                    statDictSolo.losses
                  )}%`}
                </div>
              </div>
            ) : (
              <div id="solo">
                <div id="solo-none">UNRANKED</div>
              </div>
            )}
            {statDictFlex !== undefined ? (
              <div id="flex">
                <img
                  id="flex-img"
                  className="flex flexRem"
                  src={require(`../images/${statDictFlex.tier.toLowerCase()}.png`)}
                ></img>
                <div id="flex-queue">Ranked Solo</div>
                <div id="flex-rank" className="flex flexRem">
                  {`${statDictFlex.tier} ${statDictFlex.rank}`}
                </div>
                <div id="flex-lp" className="flex flexRem">
                  {`${statDictFlex.lp} Lp`}
                </div>
                <div id="flex-win-loss" className="flex flexRem">
                  {`${statDictFlex.wins}W ${statDictFlex.losses}L`}
                </div>
                <div id="flex-wr" className="flex flexRem">
                  {`Win Rate: ${getWinRate(
                    statDictFlex.wins,
                    statDictFlex.losses
                  )}%`}
                </div>
              </div>
            ) : (
              <div id="flex">
                <div id="flex-none">UNRANKED</div>
              </div>
            )}
          </div>
          <div id="matches">{renderMatches()}</div>
        </div>
      </header>
    </div>
  );
}
