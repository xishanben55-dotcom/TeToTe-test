exports.handler = async (event) => {
  // CORS対応
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // プリフライトリクエスト対応
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { password } = JSON.parse(event.body);

    // 環境変数からパスワードを取得
    const correctPassword = process.env.TETOTE_PASSWORD;

    if (password === correctPassword) {
      // パスワードが正しい場合、リンク情報を返す
      const answerLinks = [
        {
          title: '第11回テトテスト 解答',
          url: 'https://tohkatsu-my.sharepoint.com/:b:/g/personal/260303_tohkatsu_jp/IQCQzSQtSBGNTLP_KNniBaRWAcJ_4Utv19CcopRf0iCPwrw?e=bb7DWP'
        },
        {
          title: '第11回テトテスト 全容',
          url: 'https://tohkatsu-my.sharepoint.com/:b:/g/personal/260303_tohkatsu_jp/IQCXQhV2K88GSYNOYiPITGTNAScDjtofBLBsnY9FzoJVUTM?e=gqUv8X'
        }
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          links: answerLinks
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'パスワードが正しくありません'
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'エラーが発生しました'
      }),
    };
  }
};
