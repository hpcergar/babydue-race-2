import config from "./config";


export const orientation = () => {
    screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;

    if (screen.lockOrientationUniversal && screen.lockOrientationUniversal("landscape")) {
        return true;
    }

    return false;
}




export const centerGameObjects = (objects) => {
    objects.forEach(function (object) {
        object.anchor.setTo(0.5)
    })
}

const getSpriteScale = (spriteWidth, spriteHeight, availableSpaceWidth, availableSpaceHeight, minPadding) => {
    let ratio = 1;
    let currentDevicePixelRatio = window.devicePixelRatio;
    // Sprite needs to fit in either width or height
    let widthRatio = (spriteWidth * currentDevicePixelRatio + 2 * minPadding) / availableSpaceWidth;
    let heightRatio = (spriteHeight * currentDevicePixelRatio + 2 * minPadding) / availableSpaceHeight;
    if (widthRatio > 1 || heightRatio > 1) {
        ratio = 1 / Math.max(widthRatio, heightRatio);
    }
    return ratio * currentDevicePixelRatio;
}


export const scaleSprite = (sprite, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier) => {
    let scale = getSpriteScale(sprite._frame.width, sprite._frame.height, availableSpaceWidth, availableSpaceHeight, padding);
    sprite.scale.x = scale * scaleMultiplier;
    sprite.scale.y = scale * scaleMultiplier;
}

export const calculateAttr = (resolutions) => {

    const docElement = document.documentElement

    // Get Pixel Width and Height of the available space
    let
        supportWidth = docElement.clientWidth || window.innerWidth,
        supportHeight = docElement.clientHeight || window.innerHeight,
        w_width = supportWidth * window.devicePixelRatio,
        w_height = supportHeight * window.devicePixelRatio,
        desiredWidth = w_width,
        desiredHeight = w_height,
        assetScale = 1,
        height,
        width

    for(const [index, value] of resolutions.entries()){
        assetScale = index + 1
        if(value.width >= w_width || value.height >= w_height){
            desiredWidth = value.width
            desiredHeight = value.height
            break;
        }
    }

    // We prepared all assets according to aspect ratio of our desired size
    // Since we are going to use different assets for different resolutions, we are not looking at the resolution here
    let originalAspectRatio = desiredWidth / desiredHeight;


    // Get the actual device aspect ratio
    let currentAspectRatio = w_width / w_height;
    if (currentAspectRatio > originalAspectRatio) {
        // If actual aspect ratio is greater than the game aspect ratio, then we have horizontal padding
        // In order to get the correct resolution of the asset we need to look at the height here
        // We planned for 1350x900 and 960x640 so if height is greater than 640 we pick higher resolution else lower resolution
        height = desiredHeight
        width = w_width * (desiredHeight / w_height);
    } else {
        // If actual aspect ratio is less than the game aspect ratio, then we have vertical padding
        // In order to get the correct resolution of the asset we need to look at the width here
        height = w_height * (desiredWidth / w_width)
        width = desiredWidth;
    }

    console.log('Desired width ' + desiredWidth + '. Width ' + width)
    console.log('Desired height ' + desiredHeight + '. Height ' + height)
    let widthScale = (width / desiredWidth).toFixed(2)
    let heightScale = (height / desiredHeight).toFixed(2)

return {
        "width": width
        , "height": height
        , "assetScale": assetScale
        , "widthScale": widthScale
        , "heightScale": heightScale
    }
}