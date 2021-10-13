const formRegister = document.getElementById('form-register');
const full_name = document.getElementById('full_name');
const email = document.getElementById('email');
const password = document.getElementById('password');

const resetForm = () => {
    full_name.value = "";
    email.value = "";
    password.value = "";
}

formRegister.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = { full_name: full_name.value, email: email.value, password: password.value }
    console.log({data})

    fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(result => result.json())
        .then(response => {
            resetForm();
            console.log(response);
            window.location.href = '/auth/login';
        })
        .catch(error => console.log(error));
});