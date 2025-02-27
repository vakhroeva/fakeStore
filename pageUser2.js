const btnLogout = document.getElementById("btn-logout");

//Деавторизация пользователя
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
}

btnLogout.addEventListener("click", () => {
    deleteCookie('token');
    window.location.href = 'index.html';
});