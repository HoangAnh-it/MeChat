const linkYoutubePattern = /https:\/\/www.youtube.com\/watch\?v=(.+)/ig
const linkGoogleDriverPattern = /https:\/\/drive.google.com\/file\/d\/([A-Za-z0-9]+)\/view?usp=share_link/ig

export const isLink = (input) => {
    return input.startsWith('http://') || input.startsWith('https://')
}

export const isLinkFromYoutube = (input) => {
    return linkYoutubePattern.test(input)
}

export const isLinkFromGoogleDriver = (input) => {
    return linkGoogleDriverPattern.test(input)
}