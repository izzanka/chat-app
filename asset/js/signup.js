let myAlert = document.getElementById('myAlert')
let alertMessage = document.getElementById('alertMessage')
let txtFullname = document.getElementById('txtFullname')
let txtUsername = document.getElementById('txtUsername')
let txtPassword = document.getElementById('txtPassword')
let txtConfirmPassword = document.getElementById('txtConfirmPassword')
let btnSignUp = document.getElementById('btnSignUp')
let btnAlertClose = document.getElementById('btnAlertClose')
let user_id = sessionStorage.getItem('id')

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
        const res = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            body: JSON.stringify({
                fullname: txtFullname.value,
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

if(user_id != null){
    window.location.href = "home.html"
}