function displayTime() {
    const inputUserName = document.getElementById("inputUserName");
    const inputPassword = document.getElementById("inputPassword");
    const enterForm = document.getElementById("enterForm");

    function setCookie(name, value, seconds) {
        const expires = `max-age=${seconds}`;
    
        document.cookie = `${name}=${value}; ${expires}; path=/;`;
    }

    enterForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 
        let enteredUserName = inputUserName.value;
        let enteredPassword = inputPassword.value;

        let response = await fetch('https://fakestoreapi.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": enteredUserName,
                "password": enteredPassword
            })
        });
        
        if (response.ok) {
            let json = await response.json();
            console.log(json["token"]);
            setCookie("token", json["token"], 60 * 60 * 1 * 24);
            window.location.href = 'pageUser1.html';
        } else {
            alert("Invalid username or password");
        }

    });
}

window.onload = displayTime;
