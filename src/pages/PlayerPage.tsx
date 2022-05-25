import axios from "axios";
import React from "react";
import { Route, useLocation, useParams } from "react-router-dom";

export default function PlayerPage() {
  const { id } = useParams();
  const { state } = useLocation();
  console.log(state);
  function getStats() {
    axios({
      method: "get",
      //url: `/${encryptedSumId}`,
      baseURL:
        "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner",
      params: {
        api_key: process.env.API_KEY,
      },
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <>
      <div>test</div>
      <h1>Summoner name {id}</h1>
    </>
  );
}
