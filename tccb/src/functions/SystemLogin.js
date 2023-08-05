import users from "../data/users.js";

export function newId(){
    let loop = true
    const maxLoop = 90000
    while (loop) {
        if(maxLoop === 0){
            loop = false
            return 0
        }
        const num = Math.floor(Math.random() * 90000) + 10000;
        const UserID = users.find(user => user.id === num);

        if (!UserID) {
            loop = false
            return num;
        } else {
            loop = true
            maxLoop--
        }
    }
}

