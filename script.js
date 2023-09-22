const textEl = document.querySelector('.text-typing')
let delay = 75
console.log(textEl)

var Typewriter = new Typewriter(textEl, {
	loop: false,
	delay,
})

let text = 'Easily create cool typing animation lorem bla bla bla'

Typewriter.pauseFor(1000)
	.typeString(text)
	.start()
	.callFunction(() => {
		document.querySelector('.Typewriter__cursor').style.display = 'none'
	})
