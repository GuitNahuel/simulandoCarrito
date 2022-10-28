
//variables iniciales

let shoppingCartArray = [];
let total = 0;
let productContainer = document.querySelector('.shop-items')
let totalElement = document.querySelector('.cart-total-title');
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'dc0fad0516msh857a748537e58acp1793c5jsn3a63a3f48263',
        'X-RapidAPI-Host': 'books39.p.rapidapi.com'
    }
};

//peticion de productos al servidor:
let res = await fetch('https://books39.p.rapidapi.com/CZFA4F/books', options)
let data = await res.json()
//limitando a 4 productos
let productsArray = data.slice(0, 4)
console.log(productsArray);
//imprimir productos en pantalla
productsArray.forEach(product => {
    productContainer.innerHTML += `
        <div class="shop-item" id="${product.id}">
            <span class="shop-item-title">${product.TITLE}</span>
            <img class="cart-item-image" src="./Images/libro.jpg">
            <p class="shop-item-author"> ${product.AUTHOR}</p>
                <div class="shop-item-details">
                    <span class="shop-item-price">$${product.YEAR}</span>
                    <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
                </div>
        </div>`

});
//escucho cuando se hace click en el boton
let addBtns = document.querySelectorAll('.shop-item-button')
let cartContainer = document.querySelector('.cart-items')

addBtns = [...addBtns];

addBtns.forEach(btn => {
    btn.addEventListener('click', event => {
        // Agrego los productos al carro
        // Busca el ID del producto
        let actualID = parseInt(event.target.parentNode.parentNode.id)
        console.log(actualID);
        // con el id encontrar el objeto actual
        let actualPrduct = productsArray.find(item => item.id == actualID)
        if (actualPrduct.quantity === undefined) {
            actualPrduct.quantity = 1;
        }

        console.log(actualPrduct.id);
        //preguntar si el producto que estoy agregando ya existe

        let existe = false
        shoppingCartArray.forEach(libro => {
            if (actualID == libro.id) {
                existe = true
            } else {
            }
        })
        if (existe) {
            actualPrduct.quantity++
        } else {
            shoppingCartArray.push(actualPrduct)
        }

        drawItems()
        getTotal()
        updateNumberItems()
        removeItem()
        Swal.fire(
            'Bien hecho',
            'Producto agregado correctamente al carrito',
            'success'
          )

    });
});

function getTotal() {
    //actualiza el valor total
    let sumTotal
    let total = shoppingCartArray.reduce((sum, item) => {
        sumTotal = sum + item.quantity * item.YEAR
        return sumTotal
    }, 0)
    totalElement.innerText = `$${total}`
}
function drawItems() {
    //dibujar producto en carro actualizado

    cartContainer.innerHTML = ' ';

    shoppingCartArray.forEach(item => {

        cartContainer.innerHTML += `<div class="cart-row">
    <div class="cart-item cart-column">
        <img class="cart-item-image" src="./Images/libro.jpg" width="100" height="100">
        <span class="cart-item-title">${item.TITLE}</span>
    </div>
    <span class="cart-price cart-column">${item.YEAR}</span>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" min="1" type="number" value="${item.quantity}">
        <button class="btn btn-danger" type="button">REMOVE</button>
    </div>
</div>`

    });
    removeItem() 

}

function updateNumberItems() {
    let inputNumber = document.querySelectorAll('.cart-quantity-input');

    inputNumber = [...inputNumber]

    inputNumber.forEach(item => {
        item.addEventListener('click', event => {
            //Conseguir el titulo del libro
            let actualBookTitle = event.target.parentElement.parentElement.childNodes[1].innerText;
            let actualBookQuantity = parseInt(event.target.value)
            console.log(actualBookQuantity);
            //busco el objeto con ese titulo
            let actualBookObject = shoppingCartArray.find(item => item.TITLE == actualBookTitle)
            //actualizar el numero de la quantity
            actualBookObject.quantity = actualBookQuantity
            //actualizar el precio total
            getTotal()


        })
    })
}
function removeItem() {
    let removeBtns = document.querySelectorAll('.btn-danger')
    removeBtns = [...removeBtns];
    removeBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            Swal.fire({
                title: '¿Estas seguro?',
                text: "Esta acción no se podra revertir",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar articulo'
              }).then((result) => {
                if (result.isConfirmed) {
                                //conseguir titulo del libro
            let actualBookTitle = event.target.parentElement.parentElement.childNodes[1].innerText;

            //busco el objeto con ese titulo

            let actualBookObject = shoppingCartArray.find(item => item.TITLE == actualBookTitle)
            //remover arreglo de productos de carr
            shoppingCartArray=shoppingCartArray.filter(item=>item != actualBookObject)
            drawItems()
            getTotal()
            updateNumberItems()
                  Swal.fire(
                    'Eliminado!',
                    'El producto a sido borrado.',
                    'error'
                  )
                }
              })

        })
    })



}

