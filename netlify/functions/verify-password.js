exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // デバッグログ
    console.log('Event body type:', typeof event.body);
    console.log('Event body:', event.body);

    // event.body が既にオブジェクトか文字列かを判定
    const body = typeof event.body === 'string' 
      ? JSON.parse(event.body) 
      : event.body;
    
    const { password } = body;

    if (!password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Password is required'
        })
      };
    }

    const correctPassword = process.env.TETOTE_PASSWORD;
    
    // デバッグログ：環境変数の確認
    console.log('Password provided:', password ? '✓ Yes' : '✗ No');
    console.log('Correct password set:', correctPassword ? '✓ Yes' : '✗ No');

    if (!correctPassword) {
      console.error('TETOTE_PASSWORD environment variable is not set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Server configuration error: TETOTE_PASSWORD not set'
        })
      };
    }

    if (password === correctPassword) {
      const answerLinks = [
        {
          title: '第14回テトテスト 解答',
          url: process.env.ANSWER_LINK_1 || '#'
        },
        {
          title: '第14回テトテスト 全容',
          url: process.env.ANSWER_LINK_2 || '#'
        }
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          links: answerLinks
        })
      };
    } else {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid password'
        })
      };
    }
  } catch (error) {
    console.error('Catch error:', error.message);
    console.error('Stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Server error: ' + error.message
      })
    };
  }
};
