var vh = window.innerHeight * 0.01
var chatNum = 0
// initial chatId
var chatId = uuidv4()
document.documentElement.style.setProperty('--vh', `${vh}px`)

window.addEventListener('resize', () => {
	vh = window.innerHeight * 0.01
	document.documentElement.style.setProperty('--vh', `${vh}px`)
})

var onReloadClick = () => {
	const chat = document.querySelector('.chatPage')
	const input = chat.querySelector('.chat-inputPage')
	input.value = ''

	const title = chat.querySelector('.title')
	title.innerHTML = `
      <div class="wrapper">
        <img src="${chosenBot['icon']}" alt="Chat Logo" />
        <h4>${chosenBot['bot']}</h4>    
      </div>
    `

	const main = chat.querySelector('.main')
	main.innerHTML = `
    <div class="message bot greeting-message">
      <span id="bot-response">${chosenBot['message']}</span>
    </div>
    `
}

var synth = window.speechSynthesis

function voiceControlPage(string) {
	let u = new SpeechSynthesisUtterance(string)
	u.text = string
	u.lang = 'en-aus'
	u.volume = 1
	u.rate = 1
	u.pitch = 1
	synth.speak(u)
}

function sendMessagePage() {
	let inputField = document.querySelector('.chat-inputPage')
	let input = inputField.value.trim()
	inputField.value = ''
	if (input.length < 10) {
		addChatPage(input, 'Please explain your question more. Thank you.')
		return
	}
	input != '' && outputPage(input)
	chatNum++
	if (chatNum >= 30) {
		chatNum = 0
		chatId = uuidv4()
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const inputField = document.querySelector('.chat-inputPage')
	inputField.addEventListener('keydown', function (e) {
		if (e.code === 'Enter') {
			let input = inputField.value.trim()
			input != '' && outputPage(input)
			inputField.value = ''
		}
	})
})

function outputPage(input) {
	let url = window.location.href
	url = CONFIG_API_PY_URL + 'ask_bot'
	let tokenValue = botToken
	//if (botToken) tokenValue = botToken;

	chatNum++
	if (chatNum >= 30) {
		chatNum = 0
		chatId = uuidv4()
	}

	let payload = {
		ques: input,
		chatId: chatId,
		chattoken: tokenValue,
		no: chatNum,
	}

	async function getAnswer() {
		try {
			const response = await fetch(url, {
				method: 'POST',
				mode: 'cors', // no-cors, *cors, same-origin
				cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				crossDomain: true,
				body: JSON.stringify(payload),
			})

			const responseData = await response.json()

			if (responseData.success) {
				addChatPage(input, responseData.message)
			} else {
				alert('Something went wrong. Error code GX90. Try again later.')
			}
		} catch (error) {
			alert('Something went wrong. Error code PTXB')
		}
	}
	getAnswer()
}

function addChatPage(input, product) {
	const chatPage = document.querySelector('.chatPage')
	const mainDiv = chatPage.querySelector('.main')
	let userDiv = document.createElement('div')
	userDiv.id = 'user'
	userDiv.classList.add('message')
	userDiv.classList.add('user')
	userDiv.innerHTML = `<span id="user-response">${input}</span>`
	mainDiv.appendChild(userDiv)

	let botDiv = document.createElement('div')
	botDiv.id = 'bot'
	botDiv.classList.add('message')
	botDiv.classList.add('bot')
	botDiv.innerHTML = `<span id="bot-response">${product}</span>`
	mainDiv.appendChild(botDiv)
	var scroll = chatPage.querySelector('.main')
	scroll.scrollTop = scroll.scrollHeight
	voiceControlPage(product)
}

function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
		.replace(/[018]/g, c =>
			(
				c ^
				(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
			).toString()
		)
		.slice(0, 8)
}
