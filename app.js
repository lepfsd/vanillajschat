const botones = document.querySelector('#botones')
const nombreUsuario = document.querySelector('#nombreUsuario')
const contenidoProtegido = document.querySelector('#contenidoProtegido')

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
    } else {
        console.log("no existe user");
        botones.innerHTML = /*html*/`
            <button class="btn btn-outline-success mr-2" id="btnAcceder">login</button>
        `

        iniciarSesion()
        nombreUsuario.innerHTML = 'Chat';
        contenidoProtegido.innerHTML = `
            <p class="text-center lead mt-5"> debes iniciar sesion </p> 
        `
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