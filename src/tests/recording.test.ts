import { test, expect } from '@playwright/test';
import { Client, Storage } from 'appwrite';

/* There is a known bug, the test is unable to select the screen capture dialog box and continue the test.
I tried a few approaches but for now it only works in debug mode if you manually select a screen to share and record. */

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('66fd40e300241b444c1e'); // Project ID from AppWrite

const storage = new Storage(client);

test.describe('Screen Recording Test', () => {
  test('Validate start and stop recording functionality', async ({ page }) => {
    await page.goto('http://localhost:3000'); // Goes to the start page of the program

    // Check if "Iniciar Gravação" button is present
    const startButton = page.locator('button', { hasText: 'Iniciar Gravação' });
    await expect(startButton).toBeVisible();

    // Click "Iniciar Gravação" and wait for the button to be disabled (indicating the recording started)
    await startButton.click();
    await expect(startButton).toBeDisabled();

    // Check if the "Finalizar Gravação" button becomes visible and enabled(It should be enable after the recording has started)
    const stopButton = page.locator('button', {
      hasText: 'Finalizar Gravação',
    });
    await expect(stopButton).toBeVisible();
    await expect(stopButton).toBeEnabled();

    // Wait for 10 seconds to simulate recording duration, this way it's possible to have an actual file with a 10 seconds video instead of a 0kb file
    await page.waitForTimeout(10000); // Wait for 10 seconds

    // Click "Finalizar Gravação" and wait for the recording to stop
    await stopButton.click();
    await expect(stopButton).toBeDisabled();

    // Now validate the upload to Appwrite by checking the bucket for the new file
    const bucketId = '66fd4116001a97224873'; // Bucket ID from the AppWrite
    const files = await storage.listFiles(bucketId);

    // Ensure a file has been uploaded to the Appwrite bucket
    expect(files.total).toBeGreaterThan(0);
    const lastFile = files.files[files.total - 1]; // Get the latest file uploaded

    console.log('Uploaded file:', lastFile);
    expect(lastFile).toBeTruthy();
  });
});
