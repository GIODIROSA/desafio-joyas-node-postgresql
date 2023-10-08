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

const obtenerJoyasPorFiltros = async ({
  precio_min,
  precio_max,
  categoria,
  metal,
}) => {
  try {
    let filtros = [];
    let values = [];

    const agregarFiltro = (campo, comparador, valor) => {
      values.push(valor);
      const { length } = filtros;
      filtros.push(`${campo} ${comparador} $${length + 1}`);
    };

    if (precio_min) agregarFiltro("precio", ">=", precio_min);
    if (precio_max) agregarFiltro("precio", "<=", precio_max);
    if (categoria) agregarFiltro("categoria", "=", categoria);
    if (metal) agregarFiltro("metal", "=", metal);

    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0) {
      filtros = filtros.join(" AND ");
      consulta += ` WHERE ${filtros}`;
    }

    console.log("consulta=>", consulta);

    const { rows: joyas } = await pool.query(consulta, values);
    return joyas;
  } catch (error) {
    console.error("Error en la query:", error);
    throw new Error("Error en filtrarJoyas");
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

module.exports = {
  obtenerJoyas,
  prepararHATEOAS,
  obtenerJoyasPorFiltros,
};
