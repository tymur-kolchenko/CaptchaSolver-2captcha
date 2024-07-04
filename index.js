const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");

// Use the stealth plugin
puppeteer.use(StealthPlugin());

// Use the recaptcha plugin with your 2captcha API key
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: "d4b27406ffc864fd5e48c0a5b1de45a61", // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
    },
    visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
  })
);

const browserURL = "https://basvuru.kosmosvize.com.tr/appointmentform";
const customTimeout = 120000;

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function selectAdana(page) {
  // Select the option with the text 'Adana'
  await page.evaluate(() => {
    let options = [...document.querySelectorAll("#cities option")];
    let targetOption = options.find(
      (option) => option.textContent.trim() === "Adana"
    );
    if (targetOption) {
      document.querySelector("#cities").value = targetOption.value;
      // This will trigger any event listeners attached to the select element
      document.querySelector("#cities").dispatchEvent(new Event("change"));
    }
  });
}

async function clickAnkaraButton(page) {
  // Wait for the element that contains "Ankara" to be visible on the page
  await page.waitForSelector(
    "#buttonContainer > div.col-12.col-lg-4 > div > div"
  );

  // Click on the element
  await page.evaluate(() => {
    const elements = Array.from(
      document.querySelectorAll("div.sp-selectable-button")
    );
    const targetElement = elements.find((el) =>
      el.textContent.includes("Ankara")
    );
    if (targetElement) {
      targetElement.click();
    }
  });
}

async function clickNextButton(page) {
  // Click on the button
  console.log("==== Click next button ====");
  await page.evaluate(() => {
    const button = document.querySelector(
      "#app > div.horizontal-layout.horizontal-menu.navbar-floating.footer-static > div.app-content.content.pt-0 > div > div > div > div:nth-child(3) > div > div > div.wizard-card-footer.clearfix > div.wizard-footer-right > span > button"
    );
    if (button) {
      button.click();
    }
  });
  await page.click(
    "#app > div.horizontal-layout.horizontal-menu.navbar-floating.footer-static > div.app-content.content.pt-0 > div > div > div > div:nth-child(3) > div > div > div.wizard-card-footer.clearfix > div.wizard-footer-right > span > button"
  );
}

async function Automate() {
  puppeteer.use(StealthPlugin());

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--incognito", "--start-maximized"],
    timeout: customTimeout,
  });
  const pages = await browser.pages();
  const page = pages[0] || (await browser.newPage());
  const screenSize = await page.evaluate(() => {
    return {
      width: window.screen.width,
      height: window.screen.height,
    };
  });
  await page.setViewport(screenSize);
  await page.goto(browserURL, { timeout: customTimeout });

  selectAdana(page);
  clickAnkaraButton(page);
  clickNextButton(page);
  await delay(2000);
  await page.solveRecaptchas();
}

(async () => {
  await Automate();
})();
