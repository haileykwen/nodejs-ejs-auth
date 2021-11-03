const buttonLogout = document.getElementById('button-logout');

buttonLogout.addEventListener('click', () => {
    fetch('/auth/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(result => result.json())
        .then(response => {
            if (response.status === 200) {
                window.location.href = '/auth/login';
            }
        })
        .catch(error => console.log(error));
})