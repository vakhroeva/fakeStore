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

//Получает все пары id-количество из ЛС
function getAllIdFromLocalStorage() {
    const allData = [];
    // Перебираем все ключи в localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); // Получаем ключ
        const value = localStorage.getItem(key); // Получаем значение
        try {
            allData.push(JSON.parse(value)); // Преобразуем строку в объект, если это возможно
        } catch (e) {
            // Если не удается распарсить значение, добавляем как строку
            allData.push(value);
        }
    }
    return allData;
}

//Увеличивает на 1 количество продукта в корзине
function IncAmountProduct(id) {
    let tmp = JSON.parse(localStorage.getItem(id));
    tmp.amount += 1;
    localStorage.setItem(id, JSON.stringify(tmp));

    const place = document.getElementById(`amount${id}InCart`);
    const total = document.getElementById(`total${id}sum`);
    let price = document.getElementById(`price${id}`);
    const totalCart = document.getElementById("total");

    place.innerHTML = `x${tmp.amount}`;
    price = parseFloat(price.textContent.replace("Price:    $", ""));
    total.innerHTML = `$${tmp.amount * price}`;
    sumOfCart += price;
    totalCart.innerText = `Total:    $${sumOfCart.toFixed(2)}`;
}

//Уменьшает на 1 количество продукта в корзине
function DecAmountProduct(id) {
    let tmp = JSON.parse(localStorage.getItem(id));
    let price = document.getElementById(`price${id}`);
    price = parseFloat(price.textContent.replace("Price:    $", ""));

    if (parseInt(tmp.amount) > 1 ) {
        tmp.amount -= 1;
        localStorage.setItem(id, JSON.stringify(tmp));

        const place = document.getElementById(`amount${id}InCart`);
        const total = document.getElementById(`total${id}sum`);
        place.innerHTML = `x${tmp.amount}`;
        total.innerHTML = `$${tmp.amount * price}`;
    } else {
        localStorage.removeItem(id);
        const container = document.getElementById(`div-container-${id}`);
        container.remove();
    }

    sumOfCart -= price;
    const totalCart = document.getElementById("total");   
    localStorage.length > 0 ? totalCart.innerText = `Total:    $${sumOfCart.toFixed(2)}` : totalCart.remove();
}

async function drawUserCarts () {
    const cartsPlace = document.getElementById("carts-place");
    let productsInCurrCart = getAllIdFromLocalStorage();
    

    if (productsInCurrCart.length > 0) {
        for (const product of productsInCurrCart){
            productInfo = await getProduct(product.id);
            sumOfCart += productInfo.price * product.amount;
            
            const div = document.createElement('div');
            div.id = `div-container-${product.id}`;
            div.innerHTML += `
                <div class="card mb-3 col-12">
                    <div class="row h-100">
                        <div class="col-5 col-md-4 col-lg-3 d-flex align-items-center justify-content-center p-5">  
                            <img src="${productInfo.image}" class="img-fluid rounded-start cover" alt="Product Image" style=" height: 30vh;">
                        </div>
                        <div class="col-7 col-md-8 col-lg-9">
                            <div class="card-body">
                                <a class="text-decoration-none" href = "/pageUser3.html?id=${product.id}">
                                    <h3 class="card-title fs-2">${productInfo.title}</h3>
                                </a>
                                <div>
                                    <p id="price${product.id}" class="card-text fw-bold fs-5">Price:    $${productInfo.price}</p>
                                </div>
                                <div class="d-flex flex-row justify-content-end">
                                    <button id="btn-${product.id}-minus" class="btn btn-primary fw-bold fs-5" style="width: 40px;" type="button">-</button>
                                    <p id="amount${product.id}InCart" class="fw-bold fs-5 mx-2">x${product.amount}</p>
                                    <button id="btn-${product.id}-plus" class="btn btn-primary fw-bold fs-5" style="width: 40px;" type="button">+</button>
                                </div>
                                <p id="total${product.id}sum" class="card-text fw-bold fs-3 text-end text-primary">$${productInfo.price * product.amount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            cartsPlace.appendChild(div);
            cartsPlace.addEventListener("click", (event) => {
                if (event.target && event.target.id === `btn-${product.id}-plus`) {
                    event.preventDefault();
                    IncAmountProduct(product.id);
                }
            
                if (event.target && event.target.id === `btn-${product.id}-minus`) {
                    event.preventDefault();
                    DecAmountProduct(product.id);
                }
            });
        };

        cartsPlace.innerHTML += `
            <div class="row h-100">
                <p id="total" class="col-12 fw-bold fs-3 text-end text-primary">Total:    $${sumOfCart.toFixed(2)}</p>
            </div>
        `;
        
    } else {
        console.log("Корзина пуста или произошла ошибка");
    }
}


let sumOfCart = 0;
drawUserCarts();