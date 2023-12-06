const puppeteer = require('puppeteer-extra')
const downloadImage = require("./downImage");
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(
  AdblockerPlugin({
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
  })
)

const URL = "https://www.infocasas.com.uy/dueo-vende-en-peninsula-hermoso-2-dor-piscina-ser-mucama/189740242";
async function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
puppeteer.launch({headless : false}).then(async(browser)=>{
    const page = await browser.newPage();
    await page.setViewport({width: 1900,
        height: 800,
      })
    await page.goto(URL);
    await page.waitForSelector(".cover-gradient");
    await page.click(".cover-gradient", { clickCount: 2 });
    await delay(5000);
    await page.click(".ant-modal-wrap");
    await delay(5000);
    await page.click(".ant-modal-wrap");
    var urls = await page.evaluate(()=>{
        var t = document.querySelectorAll('[class="slick-slide"] img')
        const res = [];
        for(i=0 ; i < t.length ; i++){
            res.push(t[i].src);
        }
        return res;
    })
    await browser.close();
    console.log("start downloading images");
    for(let i = 0; i < urls.length ; i++){
        console.log(urls[i]);
        await downloadImage(i,urls[i]);
    }
    return;
})