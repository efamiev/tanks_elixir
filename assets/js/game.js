const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
const tankWidth = 41
const tankHeight = 60

const keys = new Set()
let direction = ""

const start = () => {
	loadSprite().then((sprite) => {
		initInput()
		requestAnimationFrame(loop(sprite, 0, 0))
	})
}

const loop = (sprite, x, y) => () => {
	clearScreen()
	
	const [updatedX, updatedY] = updateTank(sprite, x, y)
	requestAnimationFrame(loop(sprite, updatedX, updatedY))
}

const loadSprite = () => {
	const image = new Image()
	
	return new Promise((resolve, _reject) => {
		image.src = "/images/tanks.png"
		image.addEventListener("load", () => resolve({image}))
	})
}

const updateTank = (sprite, x, y) => {
	const [updatedX, updatedY, updatedDirection] = (() => {
		if (keys.has('ArrowUp')) return y - 1 < 0 ?  [x, y, "up"] : [x, y -1, "up"]
		if (keys.has('ArrowRight'))	return x + tankHeight - 10 > canvas.width ?  [x, y, "right"] : [x + 1, y, "right"]
		if (keys.has('ArrowDown')) return y + tankHeight > canvas.height ?  [x, y, "down"] : [x, y + 1, "down"]
		if (keys.has('ArrowLeft')) return x - 10 < 0 ?  [x, y, "left"] : [x - 1, y, "left"]
		
		return [x, y, direction]
	})()

	direction = updatedDirection

	return renderPlayerTank(sprite, updatedX, updatedY)
}

const renderPlayerTank = (sprite, x, y) => {
	const tank_coords = [x, y]

	let angle 

	switch (direction) {
		case 'up':
			angle = 180 
			break
		case 'right':
			angle = 270
			break
		case 'down':
			angle = 0
			break
		case 'left':
			angle = 90
			break
	}

	drawRotatedTank(context, sprite, x, y, tankWidth, tankHeight, angle)

	return tank_coords
}

const initInput = () => {
	document.addEventListener('keydown', event => {
		switch (event.code) {
			case 'ArrowUp':
			case 'ArrowRight':
			case 'ArrowDown':
			case 'ArrowLeft':
			case 'Space':
			case 'Enter':
				event.preventDefault();
				keys.add(event.code);
		}
	});

	document.addEventListener('keyup', event => {
		switch (event.code) {
			case 'ArrowUp':
			case 'ArrowRight':
			case 'ArrowDown':
			case 'ArrowLeft':
			case 'Space':
			case 'Enter':
				event.preventDefault();
				keys.delete(event.code);
		}
	});
}

const clearScreen = () => {
	context.clearRect(0, 0, canvas.width, canvas.height)
}

const drawRotatedTank = (context, sprite, x, y, width, height, angle) => {
    // Save the current state of the context
    context.save();

    // Move the rotation point to the center of the tank
    context.translate(x + width / 2, y + height / 2);

    // Rotate the context by a given angle
    context.rotate(angle * Math.PI / 180);

    // We draw the tank taking into account that the point (0, 0) is now in the center of the tank
    context.drawImage(
        sprite.image,
        0, 0, 145, 210,   // Sprite coordinates (sprite dimensions in the image)
        -width / 2, -height / 2,  // We shift it to draw the tank relative to its center
        width, height             // Tank size on canvas
    );

    // Restore the previous state of the context
    context.restore();
}

start()

