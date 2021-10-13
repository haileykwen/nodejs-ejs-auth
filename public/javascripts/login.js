const formLogin = document.getElementById('form-login');
const email = document.getElementById("email");
const password = document.getElementById('password');

const resetForm = () => {
    email.value = "";
    password.value = "";
}

formLogin.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = { email: email.value, password: password.value }

    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(result => result.json())
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                resetForm();
                window.location.href = '/app';
            }
        })
        .catch(error => console.log(error));
});