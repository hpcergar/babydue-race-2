import { Model } from 'backbone';

class Winner extends Model{
    constructor(attributes, options){
        super(attributes, options);

        this.url = '/winner?email=' + window.app.conf.EMAIL + '&signature=' + window.app.conf.SIGNATURE;
    }
    
    defaults(){
        return {
            date: '',
            gender: '',
            positions: {}
        }
    }

    haveWinner(){
        return '' != this.get('date') && '' != this.get('gender');
    }
    
    getFirst(){
        return this.getFromPositions('1st');
    }
    
    getSecond(){
        return this.getFromPositions('2nd');
    }

    getThird(){
        return this.getFromPositions('3rd');
    }

    getFromPositions(pos){
        return this.get('positions')[pos];
    }
}

export default Winner;