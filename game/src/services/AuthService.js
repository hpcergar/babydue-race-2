import CryptoJS from 'crypto-js'
import { createHmac } from 'crypto'

const saltTime = '75POPsgZdDLMu332'

export default class {
  /**
     * Generate encrypted token by email
     *
     * @param email
     * @param signature
     * @returns {*|string}
     */
  generateToken (email, signature) {
    let rawStr = email + ':' + signature
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(rawStr))
  }

  /**
     * Generate auth header authentication
     * @returns {{Authorization: string}}
     */
  generateAuthHeader (email = null, signature = null) {
    email = email || this.getEmail()
    signature = signature || this.getSignature()
    console.log('auth data: ' + email + ' : ' + signature)
    return {
      'Authorization': 'Bearer ' + this.generateToken(
        email,
        signature)
    }
  }

  /**
     *
     * @returns {string}
     */
  getEmail () {
    return this._getURLParameter('email')
  }

  /**
     *
     * @returns {string}
     */
  getSignature () {
    return this._getURLParameter('signature')
  }

  /**
     * For time signature
     * @param time
     * @returns {*}
     */
  signTime (time) {
    return createHmac('sha256', saltTime)
      .update(time + '') // As string
      .digest('hex')
  }

  /**
     *
     * @param name
     * @returns {string | null}
     * @private
     */
  _getURLParameter (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null
  }
}
