// Variable que mantiene el estado visible del carrito
var carritoVisible = false;

// Configuración de EmailJS
var EMAILJS_PUBLIC_KEY = '8NAB05WSZvilThFUi';
var EMAILJS_SERVICE_ID = 'service_zanz2x1';
var EMAILJS_TEMPLATE_ID = 'template_f1p5gvu';
var EMAILJS_DESTINO = 'emailcesar2008@gmail.com';

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

window.addEventListener('load', function () {
    document.body.classList.add('pagina-lista');
    if (window.emailjs) {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
});

function ready() {
    // Agregar funcionalidad a los botones del carrito
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for (var i = 0; i < botonesEliminarItem.length; i++) {
        var button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }

    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for (var j = 0; j < botonesSumarCantidad.length; j++) {
        var buttonSuma = botonesSumarCantidad[j];
        buttonSuma.addEventListener('click', sumarCantidad);
    }

    var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for (var k = 0; k < botonesRestarCantidad.length; k++) {
        var buttonResta = botonesRestarCantidad[k];
        buttonResta.addEventListener('click', restarCantidad);
    }

    asignarEventosProductos();

    var formularioPedido = document.getElementById('form-pedido');
    if (formularioPedido) {
        formularioPedido.addEventListener('submit', crearPedido);
    }

    actualizarTotalCarrito();
}

function asignarEventosProductos() {
    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
        var botonAgregar = botonesAgregarAlCarrito[i];
        botonAgregar.removeEventListener('click', agregarAlCarritoClicked);
        botonAgregar.addEventListener('click', agregarAlCarritoClicked);
    }

    var botonesDetalles = document.getElementsByClassName('boton-detalles');
    for (var j = 0; j < botonesDetalles.length; j++) {
        var botonDetalles = botonesDetalles[j];
        botonDetalles.removeEventListener('click', toggleDetallesProducto);
        botonDetalles.addEventListener('click', toggleDetallesProducto);
    }
}

function toggleDetallesProducto(event) {
    var boton = event.target;
    var item = boton.closest('.item');
    if (!item) return;

    var detalles = item.getElementsByClassName('descripcion-detalles')[0];
    if (!detalles) return;

    var estaActivo = detalles.classList.contains('activo');
    detalles.classList.toggle('activo');
    boton.textContent = estaActivo ? 'Ver detalles' : 'Ocultar detalles';
}

function agregarAlCarritoClicked(event) {
    var button = event.target;
    var item = button.closest('.item');
    if (!item) return;

    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;

    agregarItemAlCarrito(titulo, precio, imagenSrc);
    hacerVisibleCarrito();
}

function hacerVisibleCarrito() {
    carritoVisible = true;

    var carrito = document.getElementsByClassName('carrito')[0];
    var items = document.getElementsByClassName('contenedor-items')[0];

    if (carrito) {
        carrito.style.marginRight = '0';
        carrito.style.opacity = '1';
    }

    if (items) {
        items.style.width = '60%';
    }
}

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    var item = document.createElement('div');
    item.classList.add('item');

    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];
    if (!itemsCarrito) return;

    var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (var i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText === titulo) {
            mostrarMensajeTemporal('Ese producto ya está en tu carrito.');
            return;
        }
    }

    var itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar" type="button">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;

    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);
    item.getElementsByClassName('restar-cantidad')[0].addEventListener('click', restarCantidad);
    item.getElementsByClassName('sumar-cantidad')[0].addEventListener('click', sumarCantidad);

    actualizarTotalCarrito();
}

function sumarCantidad(event) {
    var selector = event.target.parentElement;
    var inputCantidad = selector.getElementsByClassName('carrito-item-cantidad')[0];
    var cantidadActual = parseInt(inputCantidad.value, 10);
    inputCantidad.value = cantidadActual + 1;
    actualizarTotalCarrito();
}

function restarCantidad(event) {
    var selector = event.target.parentElement;
    var inputCantidad = selector.getElementsByClassName('carrito-item-cantidad')[0];
    var cantidadActual = parseInt(inputCantidad.value, 10);

    if (cantidadActual > 1) {
        inputCantidad.value = cantidadActual - 1;
        actualizarTotalCarrito();
    }
}

function eliminarItemCarrito(event) {
    var boton = event.target.closest('.btn-eliminar');
    if (boton) {
        boton.parentElement.remove();
        actualizarTotalCarrito();
        ocultarCarrito();
    }
}

function ocultarCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    var carrito = document.getElementsByClassName('carrito')[0];
    var items = document.getElementsByClassName('contenedor-items')[0];

    if (!carritoItems || !carrito || !items) return;

    if (carritoItems.childElementCount === 0) {
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;
        items.style.width = '100%';
    }
}

function actualizarTotalCarrito() {
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    if (!carritoContenedor) return;

    var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    var total = 0;

    for (var i = 0; i < carritoItems.length; i++) {
        var item = carritoItems[i];
        var precioTexto = item.getElementsByClassName('carrito-item-precio')[0].innerText;
        var precio = parseFloat(precioTexto.replace('$', '').replace(',', '').trim());
        var cantidad = parseInt(item.getElementsByClassName('carrito-item-cantidad')[0].value, 10);
        total += precio * cantidad;
    }

    total = Math.round(total * 100) / 100;

    var totalElemento = document.getElementsByClassName('carrito-precio-total')[0];
    if (totalElemento) {
        totalElemento.innerText = '$' + total.toLocaleString('es-MX') + '.00';
    }
}

function obtenerResumenPedido() {
    var carritoItems = document.getElementsByClassName('carrito-item');
    var resumen = [];

    for (var i = 0; i < carritoItems.length; i++) {
        var item = carritoItems[i];
        var titulo = item.getElementsByClassName('carrito-item-titulo')[0].innerText;
        var precio = item.getElementsByClassName('carrito-item-precio')[0].innerText;
        var cantidad = item.getElementsByClassName('carrito-item-cantidad')[0].value;

        resumen.push(titulo + ' x' + cantidad + ' - ' + precio);
    }

    return resumen;
}

function vaciarCarrito() {
    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];
    if (itemsCarrito) {
        itemsCarrito.innerHTML = '';
    }
    actualizarTotalCarrito();
    ocultarCarrito();
}

function crearPedido(event) {
    event.preventDefault();

    var formulario = event.target;
    var nombreInput = document.getElementById('nombre-cliente');
    var telefonoInput = document.getElementById('telefono-cliente');
    var mensajePedido = document.getElementById('mensaje-pedido');
    var botonPedido = formulario.querySelector('.boton-pedido');
    var carritoItems = document.getElementsByClassName('carrito-item');

    var nombre = nombreInput ? nombreInput.value.trim() : '';
    var telefono = telefonoInput ? telefonoInput.value.trim() : '';

    if (!mensajePedido || !botonPedido) return;

    if (carritoItems.length === 0) {
        mensajePedido.innerHTML = 'Agrega al menos un producto al carrito para crear tu pedido.';
        mensajePedido.classList.add('activo');
        return;
    }

    if (!nombre || !telefono) {
        mensajePedido.innerHTML = 'Completa tu nombre y teléfono para crear el pedido.';
        mensajePedido.classList.add('activo');
        return;
    }

    if (!window.emailjs) {
        mensajePedido.innerHTML = 'No se pudo cargar EmailJS. Revisa tu conexión y vuelve a intentarlo.';
        mensajePedido.classList.add('activo');
        return;
    }

    var totalElemento = document.getElementsByClassName('carrito-precio-total')[0];
    var total = totalElemento ? totalElemento.innerText : '$0.00';
    var resumenPedido = obtenerResumenPedido();

    var detallePedido = resumenPedido.join('\n');

    var templateParams = {
        to_email: EMAILJS_DESTINO,
        email: EMAILJS_DESTINO,
        destino: EMAILJS_DESTINO,
        nombre_cliente: nombre,
        telefono_cliente: telefono,
        detalle_pedido: detallePedido,
        total_pedido: total,
        mensaje: 'Nuevo pedido recibido desde la página web.'
    };

    botonPedido.disabled = true;
    botonPedido.textContent = 'Enviando...';
    mensajePedido.innerHTML = 'Enviando pedido...';
    mensajePedido.classList.add('activo');

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function () {
            mensajePedido.innerHTML =
                `Pedido enviado a <strong>${EMAILJS_DESTINO}</strong>.<br>` +
                `Cliente: <strong>${nombre}</strong>.<br>` +
                `Teléfono: <strong>${telefono}</strong>.<br>` +
                `Total a cobrar: <strong>${total}</strong>.`;

            mensajePedido.classList.add('activo');
            formulario.reset();
            vaciarCarrito();
        })
        .catch(function (error) {
            console.error('Error al enviar el pedido:', error);
            mensajePedido.innerHTML = 'No se pudo enviar el pedido por correo. Revisa la plantilla de EmailJS. Error: ' + (error && (error.text || error.status || error.message) ? (error.text || error.status || error.message) : 'desconocido');
            mensajePedido.classList.add('activo');
        })
        .finally(function () {
            botonPedido.disabled = false;
            botonPedido.textContent = 'Crear pedido';
        });
}

function mostrarMensajeTemporal(texto) {
    var mensajePedido = document.getElementById('mensaje-pedido');
    if (!mensajePedido) return;

    mensajePedido.innerHTML = texto;
    mensajePedido.classList.add('activo');

    clearTimeout(window.temporizadorMensajePedido);
    window.temporizadorMensajePedido = setTimeout(function () {
        mensajePedido.classList.remove('activo');
        mensajePedido.innerHTML = '';
    }, 2200);
}

// Lista de productos
const productos = [
    {
        nombre: 'Carlota',
        precio: '$40',
        img: 'img/Productos/e1.png',
        descripcion: 'Postre frío, suave y cremoso, con una textura ligera que se deshace en la boca. Decorada con un toque crujiente de galleta y ralladura de limón.',
        ingredientes: ['Limón', 'Leche evaporada', 'Leche condensada', 'Galleta']
    },
    {
        nombre: 'Hotcake',
        precio: '$40',
        img: 'img/Productos/e2.png',
        descripcion: 'Suaves y esponjosos hot cakes rellenos, acompañados de rodajas de plátano y bañados con un toque dulce de lechera.',
        ingredientes: ['Huevos', 'Leche', 'Harina', 'Azúcar', 'Mantequilla']
    },
    {
        nombre: 'Creepe roll de Ferrero',
        precio: '$40',
        img: 'img/Productos/e3.png',
        descripcion: 'Delicioso rollo relleno con capas suaves y cubierto de chocolate con textura crujiente, coronado con trozos de chocolate que intensifican su sabor.',
        ingredientes: ['Huevo', 'Harina', 'Azúcar glass', 'Mantequilla', 'Cocoa', 'Chocomilk', 'Chocolate', 'Queso crema', 'Leche']
    },
    {
        nombre: 'Creepe roll de Mango',
        precio: '$40',
        img: 'img/Productos/e4.png',
        descripcion: 'Delicioso rollo de crepa relleno con suaves capas de crema fresca y jugosos cubos de mango, cubierto con un toque de azúcar glass y trozos de fruta.',
        ingredientes: ['Harina', 'Mantequilla', 'Huevo', 'Azúcar glass', 'Crema chantillí', 'Mango']
    }
];

function filtrarProductos() {
    const busquedaInput = document.getElementById('busqueda');
    const lista = document.getElementById('listaFiltrada');

    if (!busquedaInput || !lista) return;

    const busqueda = busquedaInput.value.toLowerCase();
    lista.innerHTML = '';

    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda)
    );

    productosFiltrados.forEach(producto => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `
            <span class="titulo-item">${producto.nombre}</span>
            <img src="${producto.img}" alt="${producto.nombre}" class="img-item">
            <span class="precio-item">${producto.precio}</span>
            <div class="acciones-item">
                <button class="boton-item" type="button">Agregar al Carrito</button>
                <button class="boton-detalles" type="button">Ver detalles</button>
            </div>
            <div class="descripcion-detalles">
                <p class="descripcion-texto">${producto.descripcion}</p>
                <p class="descripcion-subtitulo">Ingredientes:</p>
                <ul class="descripcion-lista">
                    ${producto.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
                </ul>
            </div>
        `;
        lista.appendChild(item);
    });

    asignarEventosProductos();
}

// Función para redirigir a la sección del carrito
function scrollToSection() {
    var carrito = document.getElementById('carrito');
    if (carrito) {
        carrito.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Habilita arrastrar el botón flotante
const floatingCart = document.getElementById('floating-cart');
let offsetX = 0;
let offsetY = 0;

// Manejador de inicio de arrastre
if (floatingCart) {
    floatingCart.addEventListener('mousedown', function (e) {
        offsetX = e.clientX - floatingCart.getBoundingClientRect().left;
        offsetY = e.clientY - floatingCart.getBoundingClientRect().top;
        document.addEventListener('mousemove', moveFloatingCart);
        document.addEventListener('mouseup', stopMovingFloatingCart);
    });
}

// Función para mover el botón al arrastrar
function moveFloatingCart(e) {
    if (!floatingCart) return;

    floatingCart.style.left = `${e.clientX - offsetX}px`;
    floatingCart.style.top = `${e.clientY - offsetY}px`;
    floatingCart.style.right = 'auto';
    floatingCart.style.bottom = 'auto';
}

// Función para detener el movimiento
function stopMovingFloatingCart() {
    document.removeEventListener('mousemove', moveFloatingCart);
    document.removeEventListener('mouseup', stopMovingFloatingCart);
}

// Función para normalizar el texto, eliminando acentos y puntos finales
function normalizarTexto(texto) {
    const acentos = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
    };

    texto = texto.replace(/[áéíóúÁÉÍÓÚ]/g, match => acentos[match]);

    if (texto.endsWith('.')) {
        texto = texto.slice(0, -1);
    }

    return texto;
}

let permisoMicrofono = false;

function iniciarBusquedaPorVoz() {
    if (!permisoMicrofono) {
        permisoMicrofono = true;
    }

    if ('webkitSpeechRecognition' in window) {
        const reconocimiento = new webkitSpeechRecognition();
        reconocimiento.lang = 'es-ES';
        reconocimiento.continuous = false;
        reconocimiento.interimResults = false;

        reconocimiento.onstart = function () {
            console.log('Escuchando...');
        };

        reconocimiento.onresult = function (event) {
            let resultado = event.results[0][0].transcript;
            resultado = normalizarTexto(resultado);

            var inputBusqueda = document.getElementById('busqueda');
            if (inputBusqueda) {
                inputBusqueda.value = resultado;
                filtrarProductos();
            }
        };

        reconocimiento.onerror = function (event) {
            console.error('Error en el reconocimiento de voz: ', event.error);
            permisoMicrofono = false;
        };

        reconocimiento.start();
    } else {
        alert('Tu navegador no soporta búsqueda por voz.');
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(() => {
            console.log('Service Worker registrado con éxito.');
        })
        .catch((error) => {
            console.log('Error al registrar el Service Worker:', error);
        });
}

