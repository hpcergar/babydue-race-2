import AuthService from './AuthService'

export default class {
  constructor () {
    this.authService = new AuthService()
  }

  /**
     *
     * @param time
     * @returns {boolean}
     */
  saveTime (time) {
    let result = false

    // Login to server, if not then go to failed auth
    $.ajax({
      url: '/highscores/' + this.authService.getEmail() + '?email=' + this.authService.getEmail() +
            '&signature=' + this.authService.getSignature() +
            '&time=' + this.authService.signTime(time),
      data: JSON.stringify({time: time}),
      type: 'PUT',
      contentType: 'application/json',
      headers: this.authService.generateAuthHeader(),
      success: function (json) {
        result = true
      },
      error: function (err) {
        console.log(err)
        alert('Error in connection')
      },
      async: false
    })

    return result
  }

  /**
     *
     * @returns {Array}
     */
  getTop10 () {
    let top10 = []
    // Login to server, if not then go to failed auth
    $.ajax({
      url: '/highscores?email=' + this.authService.getEmail() + '&signature=' + this.authService.getSignature(),
      headers: this.authService.generateAuthHeader(),
      success: function (json) {
        top10 = json
      },
      error: function (err) {
        console.log(err)
        alert('Error in connection')
      },
      async: false
    })

    return top10
  }

  /**
     * Retrieve user stored time
     * @returns {number}
     */
  getUserTime () {
    // Login to server, if not then go to failed auth
    let user = {time: 0}

    $.ajax({
      url: '/users/' + this.authService.getEmail() + '?email=' + this.authService.getEmail() + '&signature=' + this.authService.getSignature(),
      headers: this.authService.generateAuthHeader(),
      success: function (json) {
        user = json
      },
      error: function (err) {
        console.log(err)
        alert('Error in connection')
      },
      async: false
    })

    return user.time
  }

  /**
     * Returns player's position if among top 10
     * @param time
     * @returns {number}
     */
  getUserPositionInTop10 (time) {
    let top10 = this.getTop10()
    let position = top10.filter(user => user.time < time).length + 1

    return position > 10 ? false : position
  }
}
