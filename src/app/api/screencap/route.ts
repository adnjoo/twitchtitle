import { NextRequest, NextResponse } from 'next/server';
// import puppeteer from 'puppeteer-core'; // Use puppeteer-core for better compatibility with hosting platforms.
import puppeteer from 'puppeteer';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  // Validate the URL
  if (!url || !url.startsWith('http')) {
    return NextResponse.json({ error: 'Invalid or missing URL' }, { status: 400 });
  }

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    });

    const page = await browser.newPage();

    // Set the viewport
    await page.setViewport({ width: 1280, height: 720 });

    // Navigate to the specified URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Take the screenshot
    const screenshot = await page.screenshot({ type: 'png' });

    // Close the browser
    await browser.close();

    // Return the screenshot
    return new NextResponse(screenshot, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return NextResponse.json({ error: 'Failed to capture screenshot' }, { status: 500 });
  }
}
