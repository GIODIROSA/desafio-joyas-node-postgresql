const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3002;

const {
  obtenerJoyas,
  prepararHATEOAS,
  obtenerJoyasPorFiltros,
} = require("./consulta");

app.listen(PORT, () => {
  console.log(`SERVIDOR ENCENDIDO ${PORT}`);
});

app.use(express.json());
app.use(cors());

const reportarConsulta = async (req, res, next) => {
  const url = req.url;
  const { query } = req;
  console.log(
    `
      Hoy ${new Date()}
      Se ha recibido una consulta en la ruta ${url}
      con la siguiente query:
      `,
    query
  );
  next();
};

app.get("/joyas", async (req, res) => {
  try {
    const queryStrings = req.query;
    const joyas = await obtenerJoyas(queryStrings);
    const HATEOAS = await prepararHATEOAS(joyas);
    res.json(HATEOAS);
  } catch (error) {
    console.error("Error al obtener joyas:", error);
    res.status(500).json({ error: "Error al obtener joyas" });
  }
});

app.get("/joyas/filtros", reportarConsulta, async (req, res) => {
  try {
    const queryStrings = req.query;
    const joyas = await obtenerJoyasPorFiltros(queryStrings);
    res.json(joyas);
  } catch (error) {
    console.error("Error al filtrar joyas:", error);
    res.status(500).json({ error: "Error al filtrar joyas" });
  }
});

app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe");
});
