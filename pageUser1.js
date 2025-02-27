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

//Создает карточки товаров
async function createProductElements() {
    const products = await getAllProducts();

    if (Array.isArray(products) && products.length > 0) {
        const container = document.getElementById('products-place');
        container.innerHTML = '';
        
        products.forEach(product => {
            const div = document.createElement('div');
            div.classList.add("card", "col-6", "col-md-4", "col-lg-3");

            div.innerHTML = `
                <img src="${product.image}" class="card-img-top h-50" alt="Image">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">$${product.price}</p>
                    <div class="d-flex justify-content-center ">
                        <a href="#" class="btn btn-primary" id="${product.id}">Add to Cart</a>
                    </div>
                </div>
            `;
            
            container.appendChild(div);
        });
    } else {
        console.log("Продукты не найдены или произошла ошибка");
    }
}

createCategoryElements();
createProductElements();

