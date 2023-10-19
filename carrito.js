class Cerveza {
  constructor(id, nombre, precio, categoria, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
  }
}

class Catalogo {
  constructor() {
    this.cervezas = [];
    this.agregarProducto(1, "Quilmes", 650, "Nacional", "quilmes.jpg");
    this.agregarProducto(2, "Salta", 600, "Nacional", "salta-lata.jpg");
    this.agregarProducto(3, "Patagonia", 650, "Nacional", "patagonia-lata.jpg");
    this.agregarProducto(
      4,
      "Carlsberg",
      1350,
      "Importada",
      "carlsberg-lata.jpg"
    );
    this.agregarProducto(5, "Guinnes", 1350, "Importada", "guinnes-lata.jpg");
    this.agregarProducto(6, "Temple", 880, "Artesanal", "temple-lata.jpg");
    this.agregarProducto(
      7,
      "Stella",
      750,
      "Importada",
      "stella-artois-lata.jpg"
    );
    this.agregarProducto(
      8,
      "Penon del aguila",
      950,
      "Artesanal",
      "penon-aguila-lata.jpg"
    );
  }

  agregarProducto(id, nombre, precio, categoria, imagen) {
    const cerveza = new Cerveza(id, nombre, precio, categoria, imagen);
    this.cervezas.push(cerveza);
  }

  traerProducto() {
    return this.cervezas;
  }

  productoPorId(id) {
    return this.cervezas.find((cerveza) => cerveza.id === id);
  }

  productosPorNombre(palabra) {
    return this.cervezas.filter((cerveza) =>
      cerveza.nombre.toLowerCase().includes(palabra.toLowerCase())
    );
  }
}

class Carrito {
  constructor() {
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    this.carrito = carritoStorage || [];
    this.total = 0;
    this.cantidadCervezas = 0;
  }
  enElCarrito({ id }) {
    return this.carrito.find((cerveza) => cerveza.id === id);
  }
  agregar(cerveza) {
    const cervezaEnCarrito = this.enElCarrito(cerveza);

    if (!cervezaEnCarrito) {
      this.carrito.push({ ...cerveza, cantidad: 1 });
    } else {
      cervezaEnCarrito.cantidad++;
    }
    this.listar();
  }
  quitar(id) {
    const indice = this.carrito.findIndex((cerveza) => cerveza.id === id);
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      this.carrito.splice(indice, 1);
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
    }
    this.listar();
  }
  listar() {
    this.total = 0;
    this.cantidadCervezas = 0;

    divCarrito.innerHTML = "";

    for (const cerveza of this.carrito) {
      divCarrito.innerHTML += `
        <div class="cervezaCarrito">
          <h2>${cerveza.nombre}</h2>
          <p>$${cerveza.precio}</p>
          <p>Cantidad: ${cerveza.cantidad}</p>
          <button class="btnQuitar" data-id="${cerveza.id}">Quitar del carrito</button>
        </div>
      `;
      this.total += cerveza.precio * cerveza.cantidad;
      this.cantidadCervezas += cerveza.cantidad;
    }

    const btnsQuitar = document.querySelectorAll(".btnQuitar");

    for (const boton of btnsQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idCerveza = +boton.dataset.id;
        this.quitar(idCerveza);
      });
    }
    spanCantidadCervezas.innerHTML = this.cantidadCervezas;
    spanTotalCarrito.innerText = this.total;
  }
}

const ctlg = new Catalogo();

const spanCantidadCervezas = document.querySelector("#cantidadCervezas");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divCervezas = document.querySelector("#cervezas");
const divCarrito = document.querySelector("#carrito");

const carrito = new Carrito();

cargarProductos(ctlg.cervezas);

function cargarProductos(cervezas) {
  divCervezas.innerHTML = "";

  for (const cerveza of cervezas) {
    divCervezas.innerHTML += `
    <div class="cerveza">
    <h2>${cerveza.nombre}</h2>
    <p class="precio">${cerveza.precio}</p>
    <div class="imagen">
    <img src="images/${cerveza.imagen}" width=150px />
    </div>
    <a href="#" class="btnAgregar" data-id="${cerveza.id}">Agregar al carrito </a>
    </div>
    `;
  }

  const btnsAgregar = document.querySelectorAll(".btnAgregar");

  for (const boton of btnsAgregar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const idCerveza = +boton.dataset.id;
      const cerveza = ctlg.productoPorId(idCerveza);
      carrito.agregar(cerveza);
    });
  }
}
