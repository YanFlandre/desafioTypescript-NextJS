import { defineConfig } from '@playwright/test';
// I added those flags to make the test ignore the webcam and select capture screen, it's not working properly for now. Will be fixed.
export default defineConfig({
  
  projects: [
    {
      name: 'chromium', 
      use: {
        
        headless: false,
        ignoreHTTPSErrors: true,
        launchOptions: {
          args: [
            '--enable-experimental-web-platform-features',
            '--disable-infobars',
            '--enable-usermedia-screen-capturing',
            '--allow-http-screen-capture',
            '--auto-select-desktop-capture-source=MedDeck Challenge', 
            '--ignore-certificate-errors',
            '--no-sandbox',
            '--autoplay-policy=no-user-gesture-required',
            '--disable-gpu',
            '--hide-scrollbars',
          ],
        },
      },
    },
  ],
});
