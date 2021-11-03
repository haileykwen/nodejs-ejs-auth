const formReset = document.getElementById('form-reset');
const newPassword = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');

formReset.addEventListener('submit', (event) => {
    event.preventDefault();
    if (newPassword.value === confirmPassword.value) {
        const data = { newPassword: newPassword.value }

        fetch('/help/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(result => result.json())
            .then(response => {
                if (response.status === 200) {
                    newPassword.value = '';
                    confirmPassword.value = '';
                    const existingAlert = document.getElementsByClassName('alert');
                    if (existingAlert.length > 0) existingAlert[0].remove();
    
                    var new_div = document.createElement('div');
                    new_div.className = 'alert success';
                    const message = document.createTextNode(response.message);
                    new_div.appendChild(message);
                    document.body.insertBefore(new_div, formReset);
                } else {
                    const existingAlert = document.getElementsByClassName('alert');
                    if (existingAlert.length > 0) existingAlert[0].remove();
    
                    var new_div = document.createElement('div');
                    new_div.className = 'alert danger';
                    const message = document.createTextNode(response.message);
                    new_div.appendChild(message);
                    document.body.insertBefore(new_div, formReset);
                }
            })
            .catch(error => console.log(error));
    } else {
        alert("Password doesn't match");
    }
});