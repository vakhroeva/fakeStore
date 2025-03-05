const btnLogout = document.getElementById("btn-logout");
let inputCategory = '';

//Деавторизация пользователя
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
}

btnLogout.addEventListener("click", () => {
    deleteCookie('token');
    window.location.href = 'index.html';
});

//Получает все категории товаров из БД
async function getAllCategories () {
    let response = await fetch('https://fakestoreapi.com/products/categories');
    if (response.ok) {
        let categories = await response.json();
        return categories ;
        
    } else {
       return "Error";
    }
}

//Получает продукты из БД, соответствующие выбранной категории(если таковая указана), иначе - все
async function getAllProducts () {
    let url;

    if (inputCategory) {
        url = 'https://fakestoreapi.com/products/category/' + inputCategory;
    } else {
        url = 'https://fakestoreapi.com/products';
    }

    let response = await fetch(url);
    if (response.ok) {
        let products = await response.json();
        return products ;
    } else {
        return "Error";
    }
}

//Отображает категории товаров в боковом меню
async function createCategoryElements() {
    const categories = await getAllCategories();

    if (Array.isArray(categories) && categories.length > 0) {
        const container = document.getElementById('categories-nav');
        
        categories.forEach(category => {
            const div = document.createElement('a');
            div.textContent = category;

            div.classList.add("list-group-item", "list-group-item-action");
            div.href = "#";
            
            container.appendChild(div);
            div.addEventListener("click", () => {
                const allCategories = container.querySelectorAll('.list-group-item');
                allCategories.forEach(item => item.classList.remove("active"));
                inputCategory == category ? inputCategory = '' : (inputCategory = category, div.classList.add("active"));
                createProductElements();
            });
        });
    } else {
        console.log("Категории не найдены или произошла ошибка");
    }
}

//Получение продукта из БД по id
async function getProduct (id) {
    let response = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (response.ok) {
        let product = await response.json();
        return product ;
        
    } else {
       return "Error";
    }
}

//Замена кнопки AddToCart на + и -, добавление продукта в ЛС
function updateAmountProduct(id) {
    const tmp = {
        id: id,
        amount: 1
    }
    localStorage.setItem(id, JSON.stringify(tmp));

    const btnAddToCart = document.getElementById(`btn-${id}`);
    btnAddToCart.remove();

    const container = document.getElementById(`div-for-btn-${id}`);
    container.innerHTML += `
        <div class="d-flex flex-row justify-content-center">
            <button id="btn-${id}-minus" class="btn btn-primary" type="button">-</button>
            <p id="amount${id}InCart" class="mx-2 my-0">x${tmp.amount}</p>
            <button id="btn-${id}-plus" class="btn btn-primary" type="button">+</button>
        </div>
    `;

    const btnInc = document.getElementById(`btn-${id}-plus`);
    if (btnInc) {
        btnInc.addEventListener("click", (event) => {
            event.preventDefault();
            IncAmountProduct(id);
        });
    };

    const btnDec = document.getElementById(`btn-${id}-minus`);
    if (btnDec) {
        btnDec.addEventListener("click", (event) => {
            event.preventDefault();
            DecAmountProduct(id);
        });
    };
}

//Увеличивает на 1 количество продукта в корзине
function IncAmountProduct(id) {
    let tmp = JSON.parse(localStorage.getItem(id));
    tmp.amount += 1;
    localStorage.setItem(id, JSON.stringify(tmp));

    const place = document.getElementById(`amount${id}InCart`);
    place.innerHTML = `x${tmp.amount}`;
}

//Уменьшает на 1 количество продукта в корзине
function DecAmountProduct(id) {
    let tmp = JSON.parse(localStorage.getItem(id));

    if (parseInt(tmp.amount) > 1 ) {
        tmp.amount -= 1;
        localStorage.setItem(id, JSON.stringify(tmp));

        const place = document.getElementById(`amount${id}InCart`);
        place.innerHTML = `x${tmp.amount}`;
    } else {
        localStorage.removeItem(id);

        const containerBtn = document.getElementById(`div-for-btn-${id}`);
        containerBtn.innerHTML = `
            <button href="#" class="btn btn-primary" id="btn-${id}">Add to Cart</button>
        `;

        const btnAddToCart = document.getElementById(`btn-${id}`);
        if (btnAddToCart) {
            btnAddToCart.addEventListener("click", (event) => {
                event.preventDefault();
                updateAmountProduct(id);
            });
        };
    }
}

//Создает карточки товаров
async function createProductElements() {
    const products = await getAllProducts();

    if (Array.isArray(products) && products.length > 0) {
        const container = document.getElementById('products-place');
        container.innerHTML = '';
        
        const row = document.createElement('div');
        row.classList.add("row", "m-0");

        products.forEach(product => {
            const div = document.createElement('div');
            div.id = product.id;
            div.classList.add("card", "col-6", "col-md-4", "col-lg-3", "d-flex", "flex-column", "h-100");

            div.innerHTML = `
                <img src="${product.image}" class="card-img-top img-fluid" alt="Image" style="height: 50vh;">
                <div class="card-body d-flex flex-column justify-content-between">
                    <a href="pageUser3.html?id=${product.id}" class="text-decoration-none">
                        <h5 class="card-title text-truncate">${product.title}</h5>
                    </a>
                    <p class="card-text">$${product.price}</p>
                    <div id="div-for-btn-${product.id}" class="d-flex justify-content-center mt-auto">
                    </div>
                </div>
            `;

            container.appendChild(div);

            const containerBtn = document.getElementById(`div-for-btn-${product.id}`);
            if (localStorage.getItem(product.id) === null) {
                containerBtn.innerHTML = `
                    <button href="#" class="btn btn-primary" id="btn-${product.id}">Add to Cart</button>
                `;
            } else {
                const tmp = JSON.parse(localStorage.getItem(product.id));
                containerBtn.innerHTML = `
                    <div class="d-flex flex-row justify-content-center">
                        <button id="btn-${product.id}-minus" class="btn btn-primary" type="button">-</button>
                        <p id="amount${product.id}InCart" class="mx-2 my-0">x${tmp.amount}</p>
                        <button id="btn-${product.id}-plus" class="btn btn-primary" type="button">+</button>
                    </div>
                `;
            }

            const btnAddToCart = document.getElementById(`btn-${product.id}`);
            if (btnAddToCart) {
                btnAddToCart.addEventListener("click", (event) => {
                    event.preventDefault();
                    updateAmountProduct(product.id);
                });
            };

            const btnInc = document.getElementById(`btn-${product.id}-plus`);
            if (btnInc) {
                btnInc.addEventListener("click", (event) => {
                    event.preventDefault();
                    IncAmountProduct(product.id);
                });
            };

            const btnDec = document.getElementById(`btn-${product.id}-minus`);
            if (btnDec) {
                btnDec.addEventListener("click", (event) => {
                    event.preventDefault();
                    DecAmountProduct(product.id);
                });
            };
        });

        container.appendChild(row);
    } else {
        console.log("Продукты не найдены или произошла ошибка");
    }
}

createCategoryElements();
createProductElements();

