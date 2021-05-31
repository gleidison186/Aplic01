const express = require("express");
const routes = express.Router();
const DB = require("./teams");

routes.get("/teams", (req, res) => {
  res.status(200).json(DB.teams);
});

routes.post("/newTeam", (req, res) => {
  const { name, city, state, series, titles, payment } = req.body;

  console.log(req.body);

  if (
    !name ||
    !city ||
    !state ||
    !titles ||
    isNaN(payment) ||
    isNaN(titles.estadual) ||
    isNaN(titles.nacional) ||
    isNaN(titles.internacional)
  ) {
    return res.status(400).json({ msg: "Campos Insuficientes ou Invalidos" });
  }

  if (
    series !== "" &&
    series !== undefined &&
    series !== "A" &&
    series !== "B" &&
    series !== "C"
  ) {
    return res.status(400).json({ msg: "Serie invalida" });
  }

  if (DB.teams.find((item) => item.name === name)) {
    return res.status(400).json({ msg: "Time Ja existe" });
  }

  let id = 0;
  if (DB.teams.length > 0) id = DB.teams[DB.teams.length - 1].id + 1;

  const newTeam = { id, name, city, state, series, titles, payment };

  DB.teams.push(newTeam);

  return res.status(200).json(newTeam);
});

routes.get("/team/:name", (req, res) => {
  const { name } = req.params;
  const arrTeams = DB.teams.filter((item) => item.name.includes(name));
  if (arrTeams.length > 0) {
    return res.status(200).json(arrTeams);
  } else {
    return res.status(400).json({ msg: "Nenhum time encontrado" });
  }
});

routes.put("/editTeam/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ msg: "Id do time invalido" });
  }

  const id = parseInt(req.params.id);

  if (!DB.teams.find((item) => item.id === id)) {
    return res.status(400).json({ msg: "Time não encontrado" });
  }

  const idSelected = DB.teams.findIndex((item) => item.id === id);

  const { name, city, state, series, titles, payment } = req.body;

  if (
    series !== "" &&
    series !== undefined &&
    series !== "A" &&
    series !== "B" &&
    series !== "C"
  ) {
    return res.status(400).json({ msg: "Serie invalida" });
  }

  if (DB.teams.find((item) => item.name === name)) {
    return res.status(400).json({ msg: "nome de time ja existente" });
  }

  if (name !== undefined && name !== "") {
    DB.teams[idSelected].name = name;
  }
  if (city !== undefined && city !== "") {
    DB.teams[idSelected].city = city;
  }
  if (state !== undefined && state !== "") {
    DB.teams[idSelected].state = state;
  }
  if (series !== undefined && series !== "") {
    DB.teams[idSelected].series = series;
  }
  if (titles !== undefined) {
    if (!isNaN(titles.estadual)) {
      DB.teams[idSelected].titles.estadual = titles.estadual;
    }
    if (!isNaN(titles.nacional)) {
      DB.teams[idSelected].titles.nacional = titles.nacional;
    }
    if (!isNaN(titles.internacional)) {
      DB.teams[idSelected].titles.internacional = titles.internacional;
    }
  }
  if (!isNaN(payment)) {
    DB.teams[idSelected].payment = payment;
  }
  return res.status(200).json(DB.teams[idSelected]);
});

routes.delete("/deleteTeam/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ msg: "Id do time invalido" });
  }

  const id = parseInt(req.params.id);

  const index = DB.teams.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(400).json({ msg: "Time não encontrado" });
  }

  DB.teams.splice(index, 1);

  return res.status(200).json({msg: "Time excluído com sucesso"})
});

module.exports = routes;
