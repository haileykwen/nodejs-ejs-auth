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
            console.log(response);
            if (response.status === 200) {
                resetForm();
                window.location.href = '/auth/login';
            } else {
                const existingAlert = document.getElementsByClassName('alert');
                if (existingAlert.length > 0) existingAlert[0].remove();

                var new_div = document.createElement('div');
                new_div.className = 'alert';
                const message = document.createTextNode(response.message);
                new_div.appendChild(message);
                document.body.insertBefore(new_div, formRegister);
            }
        })
        .catch(error => console.log(error));
});