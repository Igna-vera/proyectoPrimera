const express = require("express");

const productosRuta = require("./productos/productos-ruta");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(`/`, productosRuta);

module.exports = router;