const users = [];

module.exports = {
    createUser (user){
        users.push(user);
    },
    getAllUsers(){
        return users
    },
    findByEmail(email){
        return users.find(user => user.email === email)
    }
}