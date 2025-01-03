import axios from 'axios';
import fs from 'fs';
import path from 'path';

const TOKEN_FILE_PATH = path.resolve(process.cwd(), 'config/instagram_token.json');
const DIGITALOCEAN_API_TOKEN = process.env.DIGITALOCEAN_API_TOKEN;
const DIGITALOCEAN_APP_ID = process.env.DIGITALOCEAN_APP_ID;

async function redeployApp() {
  const url = `https://api.digitalocean.com/v2/apps/${DIGITALOCEAN_APP_ID}/deployments`;
  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          'Authorization': `Bearer ${DIGITALOCEAN_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Redeployment triggered:', response.data);
  } catch (error) {
    console.error('Error triggering redeployment:', error.response?.data || error.message);
  }
}

async function refreshToken() {
  const refreshTokenUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`;
  try {
    console.log('token refreshing');
    const response = await axios.get(refreshTokenUrl);
    const newToken = response.data.access_token;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 60); // Set expiration date to 60 days from now

    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify({ token: newToken, expires_at: expirationDate.toISOString() }));

    process.env.INSTAGRAM_ACCESS_TOKEN = newToken;

    // Trigger redeployment
    console.log('Token refreshed, redeploying application...');
    await redeployApp();
  } catch (error) {
    console.error('Error refreshing Instagram token:', error.response?.data || error.message);
  }
}

function loadToken() {
  if (fs.existsSync(TOKEN_FILE_PATH)) {
    const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE_PATH, 'utf8'));

    const expirationDate = new Date(tokenData.expires_at);
    const now = new Date();

    if (now >= expirationDate) {
      refreshToken();
      console.log('token expired');
    } else {
      console.log('fresh token');
    }
  } else {
    console.log('token expired');
    refreshToken();
  }
}

loadToken();

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN; // Long-lived Instagram Graph API token

  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}`;

  try {
    const response = await axios.get(url);
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error fetching Instagram data:', error.response?.data || error.message);
    console.error('Instagram API response:', error.response?.data);
    return new Response(
      JSON.stringify({
        message: 'Error fetching Instagram data',
        error: error.response?.data || error.message,
      }),
      { status: error.response?.status || 500 }
    );
  }
}
