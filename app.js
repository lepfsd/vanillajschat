const botones = document.querySelector('#botones')
const nombreUsuario = document.querySelector('#nombreUsuario')
const contenidoProtegido = document.querySelector('#contenidoProtegido')
const formulario = document.querySelector('#formulario')
const inputChat = document.querySelector('#inputChat')

firebase.auth().onAuthStateChanged( user => {
    if(user) {
        
        botones.innerHTML = /*html*/`
            <button class="btn btn-outline-danger" id="btnCerrarSesion">logout</button>
        `
        nombreUsuario.innerHTML = user.displayName
        cerrarSesion()
        contenidoProtegido.innerHTML = `
            <p class="text-center lead mt-5"> bienvenido ${user.email} </p> 
        `
        formulario.classList = 'input-group py-4 fixed-bottom container'
        contenidoChat(user)
    } else {
    
        botones.innerHTML = /*html*/`
            <button class="btn btn-outline-success mr-2" id="btnAcceder">login</button>
        `

        iniciarSesion()
        nombreUsuario.innerHTML = 'Chat';
        contenidoProtegido.innerHTML = `
            <p class="text-center lead mt-5"> debes iniciar sesion </p> 
        `
        formulario.classList = 'input-group py-4 fixed-bottom container d-none'
    }
})

const iniciarSesion = () => {
    const btnAcceder = document.querySelector('#btnAcceder')
    btnAcceder.addEventListener('click', async() => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider()
            await firebase.auth().signInWithPopup(provider)
        } catch (error) {
            console.log(error)
        }
    })
}

const cerrarSesion = () => {
    const btnCerrarSesion = document.querySelector('#btnCerrarSesion')
    btnCerrarSesion.addEventListener('click', () => {
        firebase.auth().signOut()
    })
}

const contenidoChat = (user) => {

    formulario.addEventListener('submit', (e) => {
        e.preventDefault()
        if(!inputChat.value.trim()) {
            console.log('input vacio')
            return
        }
        firebase.firestore().collection('chat').add({
            texto: inputChat.value,
            uid: user.uid,
            fecha: Date.now()
        })
        .then(res => {console.log('mensaje enviado')})
        .catch(e => console.log(e))
        inputChat.value = ''
    })

    firebase.firestore().collection('chat').orderBy('fecha')
        .onSnapshot(query => {
            contenidoProtegido.innerHTML = ``
            query.forEach(doc => {
                if(doc.data().uid === user.uid) {
                    contenidoProtegido.innerHTML += `
                    <div class="d-flex justify-content-end">
                        <span class="badge badge-pill badge-primary">${doc.data().texto}</span>
                    </div>
                    `
                } else {
                    contenidoProtegido.innerHTML += `
                    <div class="d-flex justify-content-start">
                        <span class="badge badge-pill badge-secondary">${doc.data().texto}</span>
                    </div>
                    `
                }
                contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight
            })
        })
}