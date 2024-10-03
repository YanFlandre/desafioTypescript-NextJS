import { defineConfig } from '@playwright/test';

/* I added those flags to make the test ignore the webcam and select capture screen, to prevent a bug where the test
is unable to select the screen capture dialog box and continue the test.*/

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
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',

          ],
        },
      },
    },
  ],
});
