# Imgur Scraper

## Usage
`node index.js -g [gallery url] -d [download directory]`

* Gallery URL is required and must be the full path to an Imgur gallery.
* Download directory is not required and will default to "download". Unless an absolute path is specified, the download directory will be created relative to `index.js`.

## Installation
1. Clone this repo.
2. Run `npm install`.
3. Download images!

## Thanks!
Wouldn't have been possible without these modules:

* https://github.com/inikulin/ineed
* https://github.com/mikeal/request
* https://github.com/substack/node-mkdirp
* https://github.com/substack/minimist
