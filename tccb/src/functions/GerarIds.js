import users from "../data/users.js";

const newId = () => {
    for (let i = 0; i < 1; i++) {
        const num = Math.floor(Math.random() * 90000) + 10000;
        const UserID = users.find(user => user.id === num);
        if (UserID) {
            i--;
        } else {
            i++;
        }
        return num;
    }
};

export default newId;
