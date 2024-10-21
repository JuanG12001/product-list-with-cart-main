let contadores;
let contadoProducto      = 0;
let contadorValorTotal   = 0;

const cargarProductos = async () => {
  try {
    const respuesta = await fetch('/server/data.json');
    const productos = await respuesta.json();
    const contenedorProductos = document.querySelector('.main__carts');

    productos.forEach(producto => {
      const productoHTML =  
      `
      <article class="main__cart"> 
        <picture class="main_pic">
          <img class="main__img" src="${producto.image.desktop}" alt="">
          <button class="main__buttoms main__buttoms-false">
            <img class="main__cart-icon" src="assets/images/icon-add-to-cart.svg" alt="">
            Add to Cart
          </button>  
          <button class="main__buttoms main__buttoms-two main__buttoms-active">
            <div class="main__buttoms-flex">
              <img class="main__icon-decrement" src="assets/images/icon-decrement-quantity.svg" alt="">
              <span class="main__contador"> </span>
              <img class="main__icon-increment" src="assets/images/icon-increment-quantity.svg" alt="">
            </div>
          </button>    
        </picture>
        <div class="main_texts">
          <h3 class="main__category">${producto.category}</h3>
          <h2 class="main__name">${producto.name}</h2>
          <h2 class="main__price">$ ${producto.price.toFixed(2)}</h2>
        </div>
      </article>
      `;
      contenedorProductos.innerHTML += productoHTML;  
    }); 

    // Ahora que los productos han sido añadidos, selecciona los botones
    /** @type {HTMLElement} */
    const botonesFalse    = document.querySelectorAll('.main__buttoms-false');
    /** @type {HTMLElement} */
    const botonesActive   = document.querySelectorAll('.main__buttoms-active');
    /** @type {HTMLElement} */
    const borderActiveIMG = document.querySelectorAll('.main__img');   
    const contadorButtom  = document.querySelectorAll('.main__contador');
    /** @type {HTMLElement} */
    const iconIncrement   = document.querySelectorAll('.main__icon-increment');
    /** @type {HTMLElement} */
    const iconDecrement   = document.querySelectorAll('.main__icon-decrement');
    const carrito         = document.querySelector('.main__your-cart-art');
    const contadorArt     = document.querySelector('.main__account-cart');
    /** @type {HTMLElement} */
    const articuloAgregado= document.querySelector('.main__your-cart-true');
    const articuloVacio   = document.querySelector('.main__your-cart-false');
    const valorTotal      = document.querySelector('.main__total-total');
    const orderTotal      = document.querySelector('.orderTotal');
    const orderConfirmed  = document.querySelector('.main__order-articulo');
    const checkOder       = document.querySelector('.main__confirm-order-true');
    const confirmarOder   = document.querySelector('.main__confirm-order-false');
    /** @type {HTMLElement} */
    const modalConfirmar  = document.querySelector('.main__order-confirmed-false');
    /** @type {HTMLElement} */
    const noInteraction   = document.querySelector('.no-interaction');
    
    // Creamos un array de contadores, inicializado en 1 para cada botón
    contadores = Array(botonesFalse.length).fill(1); 
    

    contadorArt.textContent = `(${contadoProducto})`;
    valorTotal.textContent  = `${contadorValorTotal}`;
    orderTotal.textContent  = `${contadorValorTotal}`;

    const actualizarContadorArticulos = () => {
      contadorArt.textContent = `(${contadoProducto})`;
    };

    const actualizarValorTotal = () => {
      valorTotal.textContent = `$${contadorValorTotal.toFixed(2)}`; // Solo formatea al mostrar
      orderTotal.textContent = `${contadorValorTotal.toFixed(2)}`
    };

    botonesFalse.forEach((buttonFalse, index) => {
      activarProducto(buttonFalse, botonesActive, borderActiveIMG, index, contadorButtom, contadores[index]);
      buttonFalse.addEventListener('click', () => {
        agregarAlCarrito(productos[index], carrito, contadores[index], borderActiveIMG, index, botonesFalse, botonesActive, articuloAgregado, articuloVacio);
        productosConfirmador( orderConfirmed,productos[index],contadores[index],borderActiveIMG, index, botonesFalse, botonesActive, articuloAgregado, articuloVacio )
        contadoProducto++;
        actualizarContadorArticulos(); 
        contadorButtom[index].textContent = contadores[index];
        articuloAgregado.style.display = 'block';
        articuloVacio.style.display = 'none'; 
        // Convertimos el precio a un número con parseFloat
        let precio = parseFloat(productos[index].price); // Obtén el precio como número
        contadorValorTotal += precio; // Suma directamente
        actualizarValorTotal();
      });
    });

    // Incrementar el contador
    iconIncrement.forEach((icon, index) => {
      icon.addEventListener('click', () => {
        if (contadores[index] < 10) {
          // Guardar el precio anterior
          let precioAnterior = productos[index].price * contadores[index];

          contadores[index]++;
          contadorButtom[index].textContent = contadores[index];
          agregarAlCarrito(productos[index], carrito, contadores[index], borderActiveIMG, index, botonesFalse, botonesActive, articuloAgregado, articuloVacio);
          productosConfirmador( orderConfirmed,productos[index],contadores[index],borderActiveIMG, index, botonesFalse, botonesActive, articuloAgregado, articuloVacio )
          // Sumar la diferencia al valor total
          let nuevoPrecio = productos[index].price * contadores[index];
          contadorValorTotal += (nuevoPrecio - precioAnterior); // Ajustar el total
          actualizarValorTotal();
        }
      });
    });

    // Decrementar el contador
    iconDecrement.forEach((icon, index) => {
      icon.addEventListener('click', () => {
        if (contadores[index] > 1) {
          // Guardar el precio anterior
          let precioAnterior = productos[index].price * contadores[index];

          contadores[index]--;
          contadorButtom[index].textContent = contadores[index];
          agregarAlCarrito(productos[index], carrito, contadores[index], borderActiveIMG, index, botonesFalse, botonesActive, articuloAgregado, articuloVacio);
          productosConfirmador( orderConfirmed,productos[index],contadores[index],borderActiveIMG, index, botonesFalse, botonesActive, articuloAgregado, articuloVacio )
          // Sumar la diferencia al valor total
          let nuevoPrecio = productos[index].price * contadores[index];
          contadorValorTotal += (nuevoPrecio - precioAnterior); // Ajustar el total
          actualizarValorTotal();
        }
      });
    });


    checkOder.addEventListener('click', () => {
      modalConfirmar.style.display = 'block';
      noInteraction.style.pointerEvents = 'none'; // Deshabilitar la interacción
    });
    
    confirmarOder.addEventListener('click', () => {
      modalConfirmar.style.display = 'none';
      noInteraction.style.pointerEvents = 'auto'; // Habilitar la interacción nuevamente
    });


  } catch (error) {
    console.error('Error al cargar el archivo JSON:', error);
  }
};

const activarProducto = ( buttonFalse, botonesActive, borderActiveIMG, index, contadorButtom ,contador )=>{
  buttonFalse.addEventListener("click", () => {
    buttonFalse.style.display = "none";
    botonesActive[index].style.display = "block";
    contadorButtom[index].textContent = contador
    borderActiveIMG[index].classList.add('main__img--active')
   });

}

const agregarAlCarrito = (producto, carrito, cantidad, borderActiveIMG, index, botonesFalse, botonesActive, articuloAgregado, articuloVacio) => {
  const productosEnCarrito = carrito.querySelectorAll('.main__art-text');

  let productoExistente = null;

  productosEnCarrito.forEach(item => {
    const nombreItem = item.querySelector('.main__art-name').textContent;
    if (nombreItem === producto.name) {
      productoExistente = item;
    }
  });

  const productoCantidad = (producto.price * cantidad).toFixed(2);

  if (productoExistente) {
    const cantidadElemento = productoExistente.querySelector('.main__art-cantidad');
    const cantidadProducto = productoExistente.querySelector('.main__art-price');
    cantidadElemento.textContent = `${cantidad}x`; // Actualizamos la cantidad
    cantidadProducto.textContent = `$${productoCantidad}`; // Actualizamos el precio
  } else {
    // Crear nuevo producto en el carrito
    const productoEnCarrito = document.createElement('article');
    productoEnCarrito.classList.add('main__art-text');
    productoEnCarrito.innerHTML = `
      <div class="main__your-art">
        <h3 class="main__art-name">${producto.name}</h3>
        <h3 class="main__art-number">
          <span class="main__art-cantidad">${cantidad}x</span>
          <span class="main__art-price-one">@$${producto.price.toFixed(2)}</span>
          <span class="main__art-price">$${productoCantidad}</span>
        </h3>
      </div>
      <img class="main__art-delete" src="assets/images/icon-remove-item.svg" alt="">
    `;

    
    carrito.appendChild(productoEnCarrito);

    // Manejar la eliminación de un producto
    const eliminarProducto = productoEnCarrito.querySelector('.main__art-delete');
    const confirmarOder   = document.querySelector('.main__confirm-order-false');
    
    eliminarProducto.addEventListener('click', () => {
      // Calcular el precio a eliminar
      const cantidadActual = parseInt(productoEnCarrito.querySelector('.main__art-cantidad').textContent); // Obtener la cantidad actual
      const precioAEliminar = producto.price * cantidadActual; // Calcular el precio total del producto a eliminar

      productoEnCarrito.remove(); // Eliminar del carrito
      

      // Actualizar el total de productos y el contador total
      contadorValorTotal -= precioAEliminar; // Restar el precio del producto eliminado
      document.querySelector('.main__total-total').textContent = `$${contadorValorTotal.toFixed(2)}`; // Actualizar la visualización del total

      contadoProducto--;
      if (contadoProducto < 0) contadoProducto = 0;
      document.querySelector('.main__account-cart').textContent = `(${contadoProducto})`;

      // Revertir estilos cuando el carrito esté vacío
      if (contadoProducto === 0) {
        articuloAgregado.style.display = 'none';
        articuloVacio.style.display = 'block'; // Mostrar "carrito vacío"
        contadorValorTotal = 0;
        document.querySelector('.main__total-total').textContent = `$${contadorValorTotal.toFixed(2)}`; // Actualizar visualmente el total a $0.00
      }

      
      // Reiniciar el contador para el producto eliminado
      contadores[index] = 1; // O podrías usar 0 si deseas que no haya incremento al eliminar
      borderActiveIMG[index].classList.remove('main__img--active');
      botonesActive[index].style.display = 'none';
      botonesFalse[index].style.display = 'block';



      // Actualizar la visualización del contador
      document.querySelectorAll('.main__contador')[index].textContent = contadores[index];
    });



    confirmarOder.addEventListener('click', ( )=>{
      productoEnCarrito.remove();
    })

  }
};



const productosConfirmador = (confirmado,producto,cantidad,borderActiveIMG, index, botonesFalse, botonesActive, articuloAgregado, articuloVacio) => {

    const productosEnCarrito = confirmado.querySelectorAll('.main__art-text-colum');

    let productoExistente = null;

    productosEnCarrito.forEach(item => {
      const nombreItem = item.querySelector('.main__art-name').textContent;
      if (nombreItem === producto.name) {
        productoExistente = item;
      }
    });

    const productoCantidad = (producto.price * cantidad).toFixed(2);

    if(productoExistente){
      const cantidadElemento = productoExistente.querySelector('.main__art-number');
      const cantidadProducto = productoExistente.querySelector('.main__order-price');
      cantidadElemento.textContent = `${cantidad}x`; // Actualizamos la cantidad
      cantidadProducto.textContent = `$${productoCantidad}`; // Actualizamos el precio
    }else{
      // Crear nuevo producto en el carrito
      const productoConfirmado = document.createElement('article');
      productoConfirmado.classList.add('main__art-text-colum');
      productoConfirmado.innerHTML = `
        <article class="main__art-text-2 main__art-text-colum">
            <div class="main__your-art main__order-art">
                <img class="main__order-img" src="${producto.image.thumbnail}" alt="">
                <div class="div">
                  <h3 class="main__art-name">${producto.name}</h3>
                  <h3 class="main__art-number">${cantidad}x 
                </div>
            </div>
              <span class="main__art-price main__order-price">$${productoCantidad}</span>      
        </article>
      `;
      confirmado.appendChild(productoConfirmado);

      const confirmarOder   = document.querySelector('.main__confirm-order-false');
      const eliminarProducto = document.querySelector('.main__art-delete');

      confirmarOder.addEventListener('click', ()=>{
        // Calcular el precio a eliminar
        const cantidadActual = parseInt(productoConfirmado.querySelector('.main__art-number').textContent); // Obtener la cantidad actual
        const precioAEliminar = producto.price * cantidadActual; // Calcular el precio total del producto a eliminar
        productoConfirmado.remove(); // Eliminar del carrito

        // Actualizar el total de productos y el contador total
        contadorValorTotal -= precioAEliminar; // Restar el precio del producto eliminado
        document.querySelector('.main__total-total').textContent = `$${contadorValorTotal.toFixed(2)}`; // Actualizar la visualización del total

        contadoProducto--;
        if (contadoProducto < 0) contadoProducto = 0;
        document.querySelector('.main__account-cart').textContent = `(${contadoProducto})`;

        // Revertir estilos cuando el carrito esté vacío
        if (contadoProducto === 0) {
          articuloAgregado.style.display = 'none';
          articuloVacio.style.display = 'block'; // Mostrar "carrito vacío"
          contadorValorTotal = 0;
          document.querySelector('.main__total-total').textContent = `$${contadorValorTotal.toFixed(2)}`; // Actualizar visualmente el total a $0.00
        }

        
        // Reiniciar el contador para el producto eliminado
        contadores[index] = 1; // O podrías usar 0 si deseas que no haya incremento al eliminar
        borderActiveIMG[index].classList.remove('main__img--active');
        botonesActive[index].style.display = 'none';
        botonesFalse[index].style.display = 'block';



        // Actualizar la visualización del contador
        document.querySelectorAll('.main__contador')[index].textContent = contadores[index];
        
      })


      eliminarProducto.addEventListener('click',()=>{

      })
      
    }
  
};


cargarProductos();


