const formForgot = document.getElementById('forgot-form');
const email = document.getElementById('email');

formForgot.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = { email: email.value }

    fetch('/help/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(result => result.json())
        .then(response => {
            if (response.status === 200) {
                email.value = '';
                const existingAlert = document.getElementsByClassName('alert');
                if (existingAlert.length > 0) existingAlert[0].remove();

                var new_div = document.createElement('div');
                new_div.className = 'alert success';
                const message = document.createTextNode(response.message);
                new_div.appendChild(message);
                document.body.insertBefore(new_div, formForgot);
            } else {
                const existingAlert = document.getElementsByClassName('alert');
                if (existingAlert.length > 0) existingAlert[0].remove();

                var new_div = document.createElement('div');
                new_div.className = 'alert danger';
                const message = document.createTextNode(response.message);
                new_div.appendChild(message);
                document.body.insertBefore(new_div, formForgot);
            }
        })
        .catch(error => console.log(error));
});