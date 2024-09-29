const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
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
	if (keys.has('ArrowUp')) {
		direction = "up"
		return renderPlayerTank(sprite, x, y - 1)
	} else if (keys.has('ArrowRight')) {
		direction = "right"
		return renderPlayerTank(sprite, x + 1, y)
	} else if (keys.has('ArrowDown')) {
		direction = "down"
		return renderPlayerTank(sprite, x, y + 1)
	} else if (keys.has('ArrowLeft')) {
		direction = "left"
		return renderPlayerTank(sprite, x - 1, y)
	}

	return renderPlayerTank(sprite, x, y)
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

	drawRotatedTank(context, sprite, x, y, 41, 60, angle)

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

function drawRotatedTank(context, sprite, x, y, width, height, angle) {
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

