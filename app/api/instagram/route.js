import axios from 'axios';

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN; // Long-lived Instagram Graph API token

  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}`;

  try {
    const response = await axios.get(url);
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error fetching Instagram data:', error.response?.data || error.message);
    return new Response(
      JSON.stringify({
        message: 'Error fetching Instagram data',
        error: error.response?.data || error.message,
      }),
      { status: error.response?.status || 500 }
    );
  }
}
