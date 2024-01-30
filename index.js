const { JSDOM } = require( "jsdom" );

//URL sample: "https://www.idesignsol.ca/search?type=product&filter.p.vendor=VEX+Robotics&q=Gear+Kit"
const baseUrl = "https://www.idesignsol.ca/"
const companyFilter = "&filter.p.vendor=VEX+Robotics"
const searchEndpoint = `search?type=product${companyFilter}&q=`

// initialize JSOM in the target page to avoid CORS problems
const { window } = new JSDOM("", {
    url: baseUrl,
});
const $ = require( "jquery" )( window );

function scrape(keyword) {
    keyword = keyword.toLowerCase().replaceAll(' ', '+')
    const url = baseUrl + searchEndpoint + keyword

    const startTime = new Date().getTime()

    $.get(url, function(html) {
	    const productItems = $(html).find("product-item");
        if (productItems && productItems.length > 0) {
            const productItem = productItems[0]
            const productName = $(productItem).find("a.product-item-meta__title").text();
            const serialNumber = $(productItem).find(".product-item-meta__sku").find("span").text();
            const imageUrl = "https:" + $(productItem).find("img").attr("src");
            const pageUrl = `${baseUrl}products/${productName.toLowerCase().replaceAll(' ', '-')}-${serialNumber}`
            
            console.log(`Product Name: ${productName}`)
            console.log(`Serial Number: ${serialNumber}`)
            console.log(`Page Url: ${pageUrl}`)
            console.log(`Image Url: ${imageUrl}`)

            console.log(`Elapsed Time: ${new Date().getTime() - startTime}`)
        }
    });
}

const readline = require('node:readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
readline.question(`What's the name of serial number of searching tool or part?: `, keyword => {
    scrape(keyword)
    readline.close();
});
