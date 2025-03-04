const btnLogout = document.getElementById("btn-logout");
const userId = 3;

//Деавторизация пользователя
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
}

//Деавторизация пользователя
btnLogout.addEventListener("click", () => {
    deleteCookie('token');
    window.location.href = 'index.html';
});

//Получает из БД корзины пользователя с id=userId
async function getUserCarts (id = userId) {
    let response = await fetch(`https://fakestoreapi.com/carts/user/${id}`);
    if (response.ok) {
        let carts = await response.json();
        return carts ;
    } else {
       return "Error";
    }
}

//Получает продукт из БД по id
async function getProduct (id) {
    let response = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (response.ok) {
        let product = await response.json();
        return product ;
        
    } else {
       return "Error";
    }
}

async function drawUserCarts () {
    const cartsPlace = document.getElementById("carts-place");
    const userCarts = await getUserCarts();

    if (userCarts.length > 0) {
        for (const cart of userCarts.reverse()){
            const dateCart = new Date(cart.date).toLocaleDateString();
            cartsPlace.innerHTML += `
                <div id="${dateCart}">
                    <h2 class="fw-bold fs-3">Date:    ${dateCart}</h2>
                </div>
            `;
            
            productPlace = document.getElementById(`${dateCart}`);

            let sumOfCart = 0

            idProductsInCart = cart.products;        
            for (const product of idProductsInCart){
                productInfo = await getProduct(product.productId);
                sumOfCart += productInfo.price * product.quantity;

                productPlace.innerHTML += `
                    <div class="card mb-3 col-12">
                        <div class="row h-100">
                            <div class="col-5 col-md-4 col-lg-3 d-flex align-items-center justify-content-center p-5">  
                                <img src="${productInfo.image}" class="img-fluid rounded-start cover" alt="Product Image" style=" height: 30vh;">
                            </div>
                            <div class="col-7 col-md-8 col-lg-9">
                                <a class="text-decoration-none" href = "/pageUser3.html?id=${product.productId}">
                                    <div class="card-body">
                                        <h3 class="card-title fs-2">${productInfo.title}</h3>
                                        <div class="d-flex flex-row justify-content-between">
                                            <p class="card-text fw-bold fs-5">Price:    $${productInfo.price}</p>
                                            <p class="card-text fw-bold fs-5">x${product.quantity}</p>
                                        </div>
                                        <p class="card-text fw-bold fs-3 text-end text-primary">$${productInfo.price * product.quantity}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            };

            cartsPlace.innerHTML += `
                <div class="row h-100">
                    <p class="col-12 fw-bold fs-3 text-end text-primary">Total:    $${sumOfCart}</p>
                </div>
            `;
        }
    } else {
        console.log("Корзины не найдены или произошла ошибка");
    }
}

drawUserCarts();