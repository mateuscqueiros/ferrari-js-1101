import firebase from './firebase-app'
import { getFormValues, getQueryString, hideAlertError, showAlertError } from './utils'


const authPage = document.querySelector('main#auth')

if(authPage){

    const auth = firebase.auth()

    const hideAuthForms = () => {

        document.querySelectorAll("#auth form")
        .forEach( el => el.classList.add('hide'))
    }

    const showAuthForm = id => {

        document.getElementById(id).classList.remove('hide')
    }

    const authHash = () =>{
        hideAuthForms()

        if(sessionStorage.getItem('email')){
            document.querySelectorAll('[name=email]')
            .forEach(el => el.value = sessionStorage.getItem('email'))
        }

        //analise o hash na url da window. window.location.hash
        switch(window.location.hash){
            case '#register' :
                showAuthForm('register')
                break
            case '#login' :
                showAuthForm('login')
                break
            case '#forget' :
                showAuthForm('forget')
                break
            case '#reset' :
                showAuthForm('reset')
                break
            default :
                showAuthForm('login')
        }
    }

    window.addEventListener('load', e => {
        authHash()
    })

    window.addEventListener('hashchange', e => {
        authHash()
    })

    const formAuthEmail = document.querySelector("#auth-email")

    formAuthEmail.addEventListener('submit', e => {

        e.preventDefault()
        //e.stopPropagation()
        const btnSubmit = e.target.querySelector('[type=submit]')
        btnSubmit.disabled = true

        sessionStorage.setItem('email', formAuthEmail.email.value)
        location.hash = '#login'
        btnSubmit.disabled = false
        
    })

    // Criar conta
    const formAuthRegister = document.querySelector('#register')
    const alertDangerRegister = formAuthRegister.querySelector(".alert.danger")

    formAuthRegister.addEventListener("submit", e => {

        e.preventDefault()

        alertDangerRegister.style.display = "none"

        const values = getFormValues(formAuthRegister)

        auth
            .createUserWithEmailAndPassword(values.email, values.password)
            .then(response => {

                const values = getQueryString()

               if (values.url) {
                   window.location.href = `https://location:3000${values.url}`
               } else {
                   window.location.href = "/"
               }

                window.location.href = "/"
            })
            .catch(showAlertError(formAuthRegister) )

    })

    // Logar na conta
    const formAuthLogin = document.querySelector('#login')
    const alertDangerLogin = formAuthRegister.querySelector(".alert.danger")


    formAuthLogin.addEventListener('submit', e => {

        e.preventDefault()

        const values = getFormValues(formAuthLogin)

        alertDangerLogin.style.display = "none"

        auth.
            signInWithEmailAndPassword(values.email, values.password)
            .then(response => window.location.href = "/")
            .catch(showAlertError(formAuthLogin) )


    })

    const formForget = document.querySelector('#forget')

    formForget.addEventListener('click', e => {

        e.preventDefault()

        const btnSubmit = formForget.querySelector('[type=submit]')
        const message = formForget.querySelector('.message')
        const field = formForget.querySelector('.field')
        const actions = formForget.querySelector('.actions')

        hideAlertError(formForget)

        const values = getFormValues(formForget)

        message.style.display = 'none'

        btnSubmit.disabled = true
        btnSubmit.innerHTML = 'Enviando...'

        auth
            .sendPasswordResetEmail(values.email)
            .then(() => {

                field.style.display = 'none'
                actions.style.display = 'none'
                message.style.display = 'block'

            })
            .catch(() => {

                field.style.display = 'block'
                actions.style.display = 'block'
                showAlertError(formForget)(err)

            })
            .finally(() => {

                btnSubmit.disabled = true
                btnSubmit.innerHTML = 'Enviar'

            })

    })


}