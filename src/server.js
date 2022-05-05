const express = require("express");
const { Router } = express;

const app = express();
const routerProductos = Router();
const routerCarrito = Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Contenedor = require("./contenedor");
const contenedor = new Contenedor("productos.js");
const carrito = new Contenedor("carrito.js", ["timestamp", "products"]);

//Productos

//Obtener todos los productos

routerProductos.get("/", (req, res) => {
  const productosLista = contenedor.getAll();
  res.send(productosLista);
});

//Obtener producto por id

routerProductos.get("/:id", async (req, res) => {
  const { id } = req.params;
  const productosLista = await contenedor.getById(id);

  productosLista
    ? res.status(200).json(productosLista)
    : res.status(400).json({ error: "producto no encontrado" });
});

//Agregar producto

routerProductos.post("/", async (req, res) => {
  const { title, price } = req.body;
  await contenedor.save(title, price);
  res.status(200).send(`producto cargado`);
});
//Editar productos

routerProductos.put(`/:id`, async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const wasUpdated = await contenedor.updateById(id, body);
  wasUpdated
    ? res.status(200).send(`El producto de ID: ${id} fue actualizado`)
    : res
        .status(404)
        .send(
          `El producto no fue actualizado porque no se encontró el ID: ${id}`
        );
});

//Borrar producto por id

routerProductos.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  const wasDeleted = await contenedor.deleteById(id);

  wasDeleted
    ? res.status(200).json({ success: "producto borrado" })
    : res.status(404).json({ error: "producto no encontrado" });
});

//Carrito
// POST /api/carrito

routerCarrito.post("/", async (req, res) => {
  const { body } = req;

  body.timestamp = Date.now();

  const newCartId = await carrito.saveCart(body);

  newCartId
    ? res.status(200).json({ success: "Añadido al carrito ID: " + newCartId })
    : res.status(400).json({ error: "Error" });
});

// DELETE /api/carrito/id
routerCarrito.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const wasDeleted = await carrito.deleteById(id);

  wasDeleted
    ? res.status(200).json({ success: "Borrado del carrito" })
    : res.status(404).json({ error: "Carrito no encontrado" });
});

// // GET /api/carrito/:id/productos
routerCarrito.get("/:id/productos", async (req, res) => {
  const id = parseInt(req.params.id);

  const cart = await carrito.getById(id);

  cart
    ? res.status(200).json(cart)
    : res.status(404).json({ error: "Carrito no encontrado" });
});

// // POST /api/carrito/:id/productos
// routerCarrito.post("/:id/productos", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const products = req.body.products.map(Number);
//   const allProducts = (await productContainer.getAll()).payload;
//   const foundProducts = await allProducts.filter((product) =>
//     products.includes(product.id)
//   );
//   if (foundProducts.length === 0) {
//     res.json(returnMessage(true, "No se encontraron productos", null));
//   } else {
//     const result = await cartContainer.addProductToCartById(id, foundProducts);
//     res.json(result);
//   }
// });

// // DELETE /api/carrito/:id/productos/:id_prod
// routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
//   const { id, id_prod } = req.params;
//   const productExists = await contenedor.getById(id_prod);
//   if (productExists) {
//     const cartExists = await carrito.removeFromArrayById(
//       id,
//       id_prod,
//       "products"
//     );
//     cartExists
//       ? res.status(200).json({ success: "producto elminiado" })
//       : res.status(404).json({ error: "carrito no encontrado" });
//   } else {
//     res.status(404).json({ error: "producto no encontrado" });
//   }
// });

app.use("/api/carrito", routerCarrito);
app.use("/api/productos", routerProductos);

app.listen(8080);
