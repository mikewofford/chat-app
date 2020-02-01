const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector("#messages")
// $ not necessary, just customary to denote 

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML // To render to browser
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
// target after href in index.html makes it so that you open new browser tab

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }) //ignores question mark

const autoScroll = () => {
    // Get new message element
    const $newMessage = $messages.lastElementChild

    // Get height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Get visible height
    const visibleHeight = $messages.offsetHeight

    // Get height of message container
    const containerHeight = $messages.scrollHeight

    // How far down we are currently scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault() // Prevents browser from full page default refresh

$messageFormButton.setAttribute('disabled', 'disabled')
// Disables form button once submitted

    const message = e.target.elements.message.value //document.querySelector('input').value, this way is more likely to break if there's another input
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        //Re-enables form button
        $messageFormInput.value = ''
        // Clears form
        $messageFormInput.focus()
        // Moves curser

        if (error) {
            return console.log(error)
        }
        console.log("Delivered")
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by browser')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('send-location', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

