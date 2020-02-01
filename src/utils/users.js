const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase(),
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and Room required'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'Username already taken'
        }
    }

    const user = { id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

// addUser({
//     id: 34,
//     username: 'Mike',
//     room: 'Tampa'
// })

// addUser({
//     id: 35,
//     username: 'John',
//     room: 'Tampa'
// })

// addUser({
//     id: 57,
//     username: 'Gino',
//     room: 'Cincy'
// })

const getUser = (id) => {
    return users.find((user) => user.id === id
    )}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room
    )}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

