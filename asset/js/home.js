let user_id = sessionStorage.getItem('id')
let username = sessionStorage.getItem('username')
let fullname = sessionStorage.getItem('fullname')
let avatar = document.getElementById('avatar')
let btnLogout = document.getElementById('btnLogout')
let editFullname = document.getElementById('editFullname')
let editUsername = document.getElementById('editUsername')
let btnEdit = document.getElementById('btnEdit')
let chatBox = document.getElementById('chatBox')
let listUsers = document.getElementById('listUsers')
let listFriends = document.getElementById('listFriends')

if(user_id == null){
    window.location.href = "signin.html"
}

getUserById()

avatar.src = 'https://ui-avatars.com/api/?name=' + username
chatBox.hidden = true

btnLogout.addEventListener('click', async (e) => {

    e.preventDefault()

    sessionStorage.clear()

    window.location.href = "signin.html"

})

//get user by id
async function getUserById()
{
    try{

    const res = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        body: JSON.stringify({
            user_id: user_id,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const data = await res.json()

    if(res.status != 200){

        alert(data.message)
        
    }else{

        let result = data.data

        editFullname.value = result.fullname
        editUsername.value = result.username

        dataStore = ""

        result.friends.forEach(element => {
            dataStore +=
            `
            <a href="chat.html?user_id=${element.user_id}" class="text-decoration-none">
            <div>
                <img src="https://ui-avatars.com/api/?name=${element.username}" class="rounded-pill text-start" height="40">
                <span class="ms-4 text-black">
                    <b>${element.username}</b>
                </span>
            </div>
            </a>
            <hr>
            `
        })

        document.getElementById("listFreinds").innerHTML = dataStore

    }

    }catch(err)
    {
        alert('Something wrong. please try again later!')
        console.log(err.message)
    }
}

//edit user
btnEdit.addEventListener('click', async (e) => {

    e.preventDefault()

    let fullname = editFullname.value
    let username = editUsername.value

    try{

        const res = await fetch('http://localhost:3000/api/user', {
          method: 'PUT',
          body: JSON.stringify({
            user_id: user_id,
            fullname: fullname,
            username: username
          }),
          headers: {
              'Content-Type': 'application/json'
          }
        })

        const data = await res.json()

        if(res.status != 200){

          alert(data.message)

        }else{
          
          alert(data.message)
          window.location.reload()

        }

    }catch(err)
    {
        alert('Something wrong. try again later!')
        console.log(err.message)
    }
})

//list users
listUsers.addEventListener('click', async() => {

    try{

        const res = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          body: JSON.stringify({
            username: username
          }),
          headers: {
              'Content-Type': 'application/json'
          }
        })

        const data = await res.json()

        if(res.status != 200){

            alert(data.message)

        }else{
          
            let result = data.data

            dataStore = ""

            result.forEach(element => {
                dataStore +=
                `
                <div class="row">
                    <div class="col-7">
                        <img src="https://ui-avatars.com/api/?name=${element.username}" class="rounded-pill text-start" height="40"> 
                        <span class="text-black ms-4">
                            <b>${element.username}</b>
                        </span>
                    </div>
                    <div class="col-5 text-end">
                        <input type="hidden" value="${element.id}" id="friend_id">
                        <button class="btn btn-sm btn-primary text-end mt-2" id="btnAddFriend">Add friend</button>
                    </div>
                </div>
                <hr>
                `
            })

            document.getElementById("showUsers").innerHTML = dataStore
        }

    }catch(err)
    {
        alert('Something wrong. try again later!')
        console.log(err.message)
    }
})


//list friends
listFriends.addEventListener('click', async() => {

    try{

        const res = await fetch('http://localhost:3000/api/user/friends/req', {
          method: 'POST',
          body: JSON.stringify({
            user_id: user_id
          }),
          headers: {
              'Content-Type': 'application/json'
          }
        })

        const data = await res.json()

        if(res.status != 200){

            alert(data.message)

        }else{
          
            let result = data.data

            if(result.length === 0){
                document.getElementById("showFriends").innerHTML = '<div class="text-center">No friend requests</div>'
            }else{

                dataStore = ""

                result.forEach(element => {
                    dataStore +=
                    `
                    <div class="row">
                        <div class="col-7">
                            <img src="https://ui-avatars.com/api/?name=${element.username}" class="rounded-pill text-start" height="40"> 
                            <span class="text-black ms-4">
                                <b>${element.username}</b>
                            </span>
                        </div>
                        <div class="col-5 text-end">
                            <button class="btn btn-sm btn-success text-end mt-2">Accept</button>
                        </div>
                    </div>
                    <hr>
                    `
                })

                document.getElementById("showFriends").innerHTML = dataStore
            }
        
        }

    }catch(err)
    {
        alert('Something wrong. try again later!')
        console.log(err.message)
    }
})


// document.getElementById('btnAddFriend').addEventListener('click', async(e) => {
        
//     e.preventDefault()

//     let friend_id = document.getElementById('friend_id').value

//     console.log(friend_id)

//     // try{

//     //     const res = await fetch('http://localhost:3000/api/user/friends', {
//     //       method: 'POST',
//     //       body: JSON.stringify({
//     //         user_id: user_id,
//     //         friend_id: friend_id,
//     //         user_fullname: fullname,
//     //         user_username: username
//     //       }),
//     //       headers: {
//     //           'Content-Type': 'application/json'
//     //       }
//     //     })

//     //     const data = await res.json()

//     //     if(res.status != 200){

//     //       alert(data.message)

//     //     }else{
          
//     //       alert(data.message)
//     //       window.location.reload()

//     //     }

//     // }catch(err)
//     // {
//     //     alert('Something wrong. try again later!')
//     //     console.log(err.message)
//     // }
    
// })



