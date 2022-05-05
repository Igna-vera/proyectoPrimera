const express = require("express");
const { Router } = express;

const app = express();
const routerProductos = Router();
const routerCarrito = Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Contenedor = require("./contenedor");
const contenedor = new Contenedor("productos.js");

//Productos

routerProductos.get("/", (req, res) => {
  const productosLista = contenedor.getAll();
  res.send(productosLista);
});

routerProductos.get("/:id", async (req, res) => {
  const { id } = req.params;
  const productosLista = await contenedor.getById(id);

  productosLista
    ? res.status(200).json(productosLista)
    : res.status(400).json({ error: "product not found" });
});

routerProductos.post("/", async (req, res) => {
  const { title, price } = req.body;
  await contenedor.save(title, price);
  res.status(200).send(`producto cargado`);
});
routerProductos.put(`:id`, (req, res) => {
  const {
    params: { id },
    body: { title, price, img, stock },
  } = req;

  if (!id) {
    res.status(404).send(`No encontrado`);
  }

  const productoIndex = productosLista.findIndex((e) => e.id === +id);

  if (!productoIndex)
    return res
      .status(404)
      .send({ success: false, error: `Producto no encontrado` });
  const nuevoProducto = {
    ...productosLista[productoIndex],
    title,
    price,
    img,
    stock,
  };
  productosLista[productoIndex] = nuevoProducto;
  return res.json({ success: true, result: nuevoProducto });
});

//Carrito

app.use("/api/carrito", routerCarrito);
app.use("/api/productos", routerProductos);

app.listen(8080);
