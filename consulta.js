const express = require("express");
const { Pool } = require("pg");
const format = require("pg-format");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "root",
  database: "joyas",
  allowExitOnIdle: true,
});

const obtenerJoyas = async ({ limits = 6, page = 1, order_by = "id_DESC" }) => {
  try {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;
    let formattedQuery = format(
      "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
      campo,
      direccion,
      limits,
      offset
    );
    const { rows: joyas } = await pool.query(formattedQuery);
    return joyas;
  } catch (error) {
    console.error("Error en la query:", error);
    throw new Error("Error en obtenerJoyas");
  }
};



const prepararHATEOAS = (joyas) => {
  const results = joyas
    .map((m) => {
      return {
        name: m.nombre,
        href: `/joyas/joya/${m.id}`,
      };
    })
    .slice(0, 4);

  const total = joyas.length;
  const HATEOAS = {
    total,
    results,
  };

  return HATEOAS;
};

module.exports = { obtenerJoyas, prepararHATEOAS };
