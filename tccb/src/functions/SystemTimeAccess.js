import users from "../data/users.js"

function SystemTimeAccess(){
    if(users.length >= 0){
        for(let i = 0; i < users.length; i++){
            let user = users[i]
            if(user.access === true && user.time_access === 0){
                user.access = false
            }else if(user.access === true && user.time_access > 0){
                user.time_access -= 10
            }
        }
    }
}

setInterval(SystemTimeAccess, 10000)

export default SystemTimeAccess