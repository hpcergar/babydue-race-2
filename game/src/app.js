import {Game} from './game'
import AuthService from './services/AuthService'
import $ from 'jquery'

let authService = new AuthService(),
  email = authService.getEmail(),
  signature = authService.getSignature(),
  authHeader = authService.generateAuthHeader(email, signature)

function startGame (user) {
  let navigatorLang = /es/.test(navigator.language)
      ? 'es'
      : /fr/.test(navigator.language)
          ? 'fr'
          : 'en'
  let lang = user.lg || navigatorLang

  window.game = new Game({email, signature, authHeader, lang})
}

function authError () {
  console.log('Error logging in')
  window.location.replace('/calendar')
}

// TODO Undo
if( ['localhost', '127.0.0.1', '', '::1'].includes(window.location.hostname)) {
  startGame({});
} else {
  // Login to server, if not then go to failed auth
  $.ajax({
    url: '/users/' + email + '&signature=' + signature,
    headers: authHeader,
    success: startGame,
    error: authError
  })
}