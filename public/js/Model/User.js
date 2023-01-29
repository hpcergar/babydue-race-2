import { Model } from 'backbone';

class User extends Model{
    constructor(attributes, options){
        super(attributes, options);

        this.url = '/users?email=' + window.app.conf.EMAIL + '&signature=' + window.app.conf.SIGNATURE;
    }
    
    defaults(){
        return {
            email: '',
            name:'',
            lg: ''
        }
    }

}

export default User;