// パスワード検証エンドポイント
// 環境変数から正しいパスワードとリンク情報を取得

exports.handler = async (event) => {
  // CORSヘッダーを設定
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // OPTIONSリクエスト対応
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // POSTリクエストのみ許可
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // リクエストボディからパスワードを取得
    const { password } = JSON.parse(event.body);

    // 環境変数からパスワードを取得
    const correctPassword = process.env.TETOTE_PASSWORD || '6-1,11-2';

    // パスワードを検証
    if (password === correctPassword) {
      // パスワードが正しい場合、リンク情報を返す
      const answerLinks = [
        {
          title: '第11回テトテスト 解答',
          url: process.env.ANSWER_LINK_1 || '#'
        },
        {
          title: '第11回テトテスト 全容',
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
      // パスワードが間違っている場合
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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Server error'
      })
    };
  }
};
