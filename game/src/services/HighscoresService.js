import Config from '../config'
import AuthService from './AuthService'

export default class {

    constructor() {
        this.authService = new AuthService();
    }

    /**
     *
     * @param score
     * @returns {boolean}
     */
    saveScore(score) {
        let result = false;

        // Login to server, if not then go to failed auth
        $.ajax({
            url: '/highscores/' + this.authService.getEmail() + '?email=' + this.authService.getEmail()
            + '&signature=' + this.authService.getSignature()
            + '&score=' + this.authService.signScore(score),
            data: JSON.stringify({score: score}),
            type: 'PUT',
            contentType: "application/json",
            headers: this.authService.generateAuthHeader(),
            success: function (json) {
                result = true
            },
            error: function (err) {
                console.log(err)
                alert('Error in connection')
            },
            async: false
        });

        return result;
    }

    /**
     *
     * @returns {Array}
     */
    getTop10() {

        let top10 = [];
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
        });

        return top10;
    }

    /**
     * Retrieve user stored score
     * @returns {number}
     */
    getUserScore() {
        // Login to server, if not then go to failed auth
        let user = {score:0};

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
        });

        return user.score;
    }

    /**
     * Returns score position if among top 10. Return 10 if outside (not in top10)
     * @param score
     * @returns {number}
     */
    getScorePosition(score) {
        let top10 = this.getTop10()
        let position = top10.filter(user => user.score > score).length + 1

        return position > 10 ? false : position
    }
}