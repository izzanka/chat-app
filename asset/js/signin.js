let myAlert = document.getElementById('myAlert')
let alertMessage = document.getElementById('alertMessage')
let txtUsername = document.getElementById('txtUsername')
let txtPassword = document.getElementById('txtPassword')
let btnSignIn = document.getElementById('btnSignIn')
let btnAlertClose = document.getElementById('btnAlertClose')
let user_id = sessionStorage.getItem('id')

if(user_id != null){
    window.location.href = "home.html"
}

btnAlertClose.addEventListener('click', function() {
    myAlert.classList.add('collapse')
})

function showAlert(message) {
    myAlert.classList.remove('collapse')
    alertMessage.innerHTML = message
}

const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
    
    e.preventDefault()

    try{
        const res = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            body: JSON.stringify({
                username: txtUsername.value,
                password: txtPassword.value,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await res.json()

        if(res.status != 200){

            showAlert(data.message)
            
        }else{

            sessionStorage.setItem('id', data.data.id)
            sessionStorage.setItem('fullname', data.data.fullname)
            sessionStorage.setItem('username', data.data.username)

            location.href="home.html"
        }

    }catch(err)
    {
        alert('Something wrong. please try again later!')
        console.log(err.message)
    }
})
