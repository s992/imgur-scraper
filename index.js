var fs = require("fs"),
	path = require("path"),
	argv = require("minimist")( process.argv.slice( 2 ) ),
	request = require("request"),
	mkdirp = require("mkdirp"),
	ineed = require("ineed");

var gallery = argv.g,
	dir = path.resolve( argv.d || "downloads" );

var formatGallery = function( gallery ) {

	var layoutRegex = /\/layout\/(\w+)/i,
		blogLayout = "/layout/blog",
		urlParts;

	if( !gallery.match( layoutRegex ) ) {

		urlParts = gallery.split("#");
		urlParts[ 0 ] += blogLayout;
		
		gallery = urlParts.join("#");

	} else {
		gallery = gallery.replace( layoutRegex, blogLayout );
	}

	return gallery;

};

var download = function( uri, filename, callback ) {
	request( uri ).pipe( fs.createWriteStream( filename ) ).on( "close", callback );
};

var grabImages = function( hrefs ) {

	mkdirp.sync( dir );

	console.log( "Downloading " + hrefs.length + " images to " + dir + "..." );

	hrefs.forEach( function( href ) {

		var filename = href.split("/").slice(-1)[0];

		download( href, dir + "/" + filename, function() {
			console.log( "Downloaded " + filename );
		});

	});

};

if( gallery && dir ) {

	gallery = formatGallery( gallery );

	ineed.collect.hyperlinks.from( gallery, function( err, response, result ) {

		var hrefs = [];

		if( err || !result.hyperlinks.length ) {

			console.error( "Unable to locate images at gallery: ");
			console.error( "\t" + gallery );
			console.error( "Please verify that the gallery is a valid Imgur gallery URL." );

			return;

		}

		result.hyperlinks.forEach( function( link ) {

			// there must be a better way to find the correct links..
			if( link.text && link.text == "View full resolution" ) {
				hrefs.push( link.href );
			}
			
		});

		grabImages( hrefs );

	});

} else {

	console.log( "Usage: node index.js -g [gallery url] -d [download directory]" );
	console.log( "\t-g The full URL to an Imgur gallery" );
	console.log( "\t-d The path to the download directory. Default is \"download\".");
	
}