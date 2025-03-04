const btnLogout = document.getElementById("btn-logout");
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');  // Получаем значение параметра id

//Деавторизация пользователя
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
}

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

//Отображает информацию о продукте
async function createCategoryElements() {
    const categories = await getAllCategories();
    const product = await getProduct(productId);

    const productPlace = document.getElementById("products-place");
    productPlace.innerHTML = `
    <div class="d-flex justify-content-center align-items-center min-vh-100">
        <div class="card w-75">
            <img src="${product.image}" class="card-img-top w-25 mx-auto" alt="Product Image">
            <div class="card-body">
                <div class="row d-flex justify-content-between align-items-center">
                    <h2 class="card-title col-12 col-lg-8">${product.title}</h2>
                    <h2 class="card-title col-6 col-lg-2">$${product.price}</h2>
                    <a href="#" class="btn btn-primary col-6 col-lg-2" id="${product.id}">Add to Cart</a>
                </div>
                <p class="card-text">${product.description}</p>
            </div>
        </div>
    </div>
`;

    if (Array.isArray(categories) && categories.length > 0) {
        const container = document.getElementById('categories-nav');
        
        categories.forEach(category => {
            const div = document.createElement('a');
            div.textContent = category;
            div.classList.add("list-group-item");

            product.category == category ? div.classList.add("active") : div.classList.remove("active");

            container.appendChild(div);
        });
    } else {
        console.log("Категории не найдены или произошла ошибка");
    }
}

createCategoryElements();