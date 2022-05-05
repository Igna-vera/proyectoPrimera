const fs = require(`fs`);

class Contenedor {
  constructor(nombreArchivo) {
    this.nombreArchivo = nombreArchivo;
    this.id = 1;
  }
  //Guardar producto

  save(title, price) {
    let producto = { title: title, price: price, id: this.id };
    let productos = [];

    try {
      let data = fs.readFileSync(this.nombreArchivo, `utf-8`);
      productos = JSON.parse(data);
    } catch (e) {
      console.log("archivo no creado");
    }
    productos.push(producto);
    fs.writeFileSync(this.nombreArchivo, JSON.stringify(productos));
    this.id++;
  }
  //Guardar carrito

  async saveCart(object) {
    try {
      const allData = await this.getData();
      const parsedData = JSON.parse(allData);

      object.id = parsedData.length + 1;
      parsedData.push(object);

      await fs.promises.writeFile(
        this.nombreArchivo,
        JSON.stringify(parsedData)
      );
      return object.id;
    } catch (error) {
      console.log(`Error: ${error.code} | error al intentar guardar`);
    }
  }

  // async addProductToCartById(id, product) {
  //   try {
  //     const carts = await this.getAll();
  //     const cartIndex = carts.findIndex((cart) => cart.id === id);
  //     if (cartIndex === -1) {
  //       return returnMessage(true, "El carrito no existe", null);
  //     }
  //     const cart = carts[cartIndex];
  //     cart.products = [...cart.products, ...product];
  //     carts[cartIndex] = cart;
  //     await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
  //     return returnMessage(false, "Producto agregado al carrito", cart);
  //   } catch (error) {
  //     return returnMessage(
  //       true,
  //       "Error al agregar el producto al carrito",
  //       null
  //     );
  //   }
  // }
  //Producto Por ID
  async getById(id) {
    id = Number(id);
    try {
      const data = await this.getData();
      const parsedData = JSON.parse(data);

      return parsedData.find((producto) => producto.id === id);
    } catch (error) {
      console.log(
        `Error: ${error.code} | Error al intentar encontrar elemento (${id})`
      );
    }
  }
  //Actualizar Producto Por ID
  async updateById(id, newData) {
    try {
      id = Number(id);
      const data = await this.getData();
      const parsedData = JSON.parse(data);
      const objectIdToBeUpdated = parsedData.find(
        (producto) => producto.id === id
      );
      if (objectIdToBeUpdated) {
        const index = parsedData.indexOf(objectIdToBeUpdated);
        const { title, price } = newData;

        parsedData[index]["title"] = title;
        parsedData[index]["price"] = price;

        await fs.promises.writeFile(
          this.nombreArchivo,
          JSON.stringify(parsedData)
        );
        return true;
      } else {
        console.log(`Id ${id} No existe el archivo`);
        return null;
      }
    } catch (error) {
      `Error: ${error.code} | Error al encontrar (${id})`;
    }
  }

  //Borrar producto por id

  async deleteById(id) {
    try {
      id = Number(id);
      const data = await this.getData();
      const parsedData = JSON.parse(data);
      const objectIdToBeRemoved = parsedData.find(
        (producto) => producto.id === id
      );

      if (objectIdToBeRemoved) {
        const index = parsedData.indexOf(objectIdToBeRemoved);
        parsedData.splice(index, 1);
        await fs.promises.writeFile(
          this.nombreArchivo,
          JSON.stringify(parsedData)
        );
        return true;
      } else {
        console.log(`ID ${id} does not exist in the file`);
        return null;
      }
    } catch (error) {
      console.log(
        `Error Code: ${error.code} | There was an error when trying to delete an element by its ID (${id})`
      );
    }
  }

  getAll() {
    let productos = [];
    try {
      let data = fs.readFileSync(this.nombreArchivo, `utf-8`);
      productos = JSON.parse(data);
    } catch (e) {
      console.log("archivo no creado");
    }
    return productos;
  }

  async getAllChat() {
    const data = await this.getData();
    return JSON.parse(data);
  }
  async saveChat(object) {
    try {
      const allData = await this.getData();
      const parsedData = JSON.parse(allData);

      object.id = parsedData.length + 1;
      parsedData.push(object);

      await fs.promises.writeFile(
        this.nombreArchivo,
        JSON.stringify(parsedData)
      );
      return object.id;
    } catch (error) {
      console.log(
        `Error Code: ${error.code} | There was an error when trying to save an element`
      );
    }
  }

  //Obtener datos del archivo

  async getData() {
    const data = await fs.promises.readFile(this.nombreArchivo, "utf-8");
    return data;
  }

  deleteAll() {
    let productos = [];

    try {
      let data = fs.readFileSync(this.nombreArchivo, `utf-8`);
      productos = JSON.parse(data);
    } catch (e) {
      console.log("archivo no creado");
    }
    productos.length = 0;
    console.log(" deleteAll" + productos);
  }

  getRandom(productos) {
    try {
      let data = fs.readFileSync(this.nombreArchivo, `utf-8`);
      productos = JSON.parse(data);
    } catch (e) {
      console.log("archivo no creado");
    }
    let productoRandom =
      productos[Math.floor(Math.random() * productos.length)];
    return productoRandom;
  }
}

module.exports = Contenedor;
