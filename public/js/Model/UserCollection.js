import {Collection} from 'backbone';
import Backbone from 'Security/BackboneBet';
import User from 'Model/User';


class UserCollection extends Collection{

    constructor(models, options){
        super(models, options);

        this.url = '/users';

        this.model = User;
    }

    /**
     * Get user by given email
     * 
     * @param email
     * @returns User
     */
    findUserNameByEmail(email){
        var result = this.findWhere({email: email});
        
        return (result ? result.get('name') : null);
    }

    // Parse from server
    parse(response){

        for(var key in response){
            if(response.hasOwnProperty(key)){
                this.push({email: key, name: response[key]["name"], lg:response[key]["lg"]});
            }
        }

        return {};
    }

}


export default UserCollection;
