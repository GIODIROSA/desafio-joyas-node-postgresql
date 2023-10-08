const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3002;

const { obtenerJoyas, prepararHATEOAS } = require("./consulta");

app.listen(PORT, () => {
  console.log(`SERVIDOR ENCENDIDO ${PORT}`);
});

app.use(express.json());
app.use(cors());

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

app.get("/personal/filtros", async (req, res) => {
    const queryStrings = req.query;
    const personal = await obtenerPersonalPorFiltros(queryStrings);
    res.json(personal);
  });

app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe");
});
