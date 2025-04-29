// person.js
class Person {
    constructor(id, name) {
        this.id = id; 
        this.name = name; 
        this.dice = [1, 2, 3, 4, 5]; 
        this.heldDice = [false, false, false, false, false]; 
        this.rollnumber = 0; 
        this.points = {
            ettere: 0,
            toere: 0,
            treere: 0,
            firere: 0,
            femmere: 0,
            seksere: 0,
            sum: 0,
            bonus: 0,
            par: 0,
            toPar: 0,
            treEns: 0,
            fireEns: 0,
            fuldHus: 0,
            lilleStraight: 0,
            storeStraight: 0,
            chancen: 0,
            yatzy: 0,
            total: 0
        };
        this.endgame = false;
    }
}

module.exports = Person;
