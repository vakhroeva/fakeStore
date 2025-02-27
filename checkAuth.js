function checkCookie(name) {
    const cookies = document.cookie.split(';'); // Разбиваем строку куки на отдельные пары ключ-значение
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim(); // Убираем лишние пробелы
        if (cookie.indexOf(name + '=') === 0) {
            return true; // Если найдено соответствие с ключом
        }
    }
    return false; // Куки с таким ключом нет
}

if (checkCookie('token')) {
    console.log('Пользователь авторизован');
} else {
    console.log('Пользователь не авторизован');
    window.location.href = 'index.html';
}