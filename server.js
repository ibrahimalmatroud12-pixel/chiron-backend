const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// تفعيل CORS ليعمل الربط مع الواجهة بدون حظر
app.use(cors());
app.use(express.json());

// 1. الصفحة الرئيسية لتأكيد عمل السيرفر
app.get('/', (req, res) => {
  res.send('Chiron backend draait correct ✅');
});

// دالة مساعدة لجلب Access Token من سيرفر Chiron الرسمي
async function getChironToken(clientId, clientSecret) {
  const tokenUrl = 'https://chiron.vlaanderen.be/oauth/token'; // رابط التوكن الرسمي
  
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  const response = await axios.post(tokenUrl, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return response.data.access_token;
}

// 2. Endpoint لاستقبال البيانات من المتصفح وإرسالها لشيرون عند الضغط على الزر
app.post('/chiron/verzoek', async (req, res) => {
  try {
    const { client_id, client_secret, chiron_id, kbo, driver_card, license_plate, trips } = req.body;
    console.log('Data ontvangen van frontend:', { chiron_id, kbo, license_plate });

    // قراءة المفاتيح من المتصفح أولاً، وإذا كانت فارغة يقرأها من Render
    const cId = client_id || process.env.CHIRON_CLIENT_ID;
    const cSecret = client_secret || process.env.CHIRON_CLIENT_SECRET;

    if (!cId || !cSecret) {
      return res.status(400).json({ 
        status: 'ERROR', 
        bericht: 'Client ID أو Client Secret غير متوفرين (قم بتعبئتهما من المتصفح)' 
      });
    }

    // أ) طلب التوكن الرسمي من Chiron
    const accessToken = await getChironToken(cId, cSecret);

    // ب) إرسال بيانات الرحلات إلى Chiron
    const chironApiUrl = 'https://chiron.vlaanderen.be/api/v1/trips';
    
    const chironResponse = await axios.post(chironApiUrl, {
      chiron_id,
      kbo,
      driver_card,
      license_plate,
      trips
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // ج) إرجاع النتيجة الحقيقية القادمة من Chiron إلى المتصفح
    res.status(200).json({
      status: 'SUCCESS',
      bericht: 'Rit succesvol verwerkt door Chiron',
      chironData: chironResponse.data
    });

  } catch (error) {
    console.error('Error in Chiron request:', error.response?.data || error.message);
    res.status(500).json({ 
      status: 'ERROR', 
      bericht: 'Er is een fout opgetreden bij het verzenden naar Chiron',
      errorDetails: error.response?.data || error.message 
    });
  }
});

// 3. Endpoint لاستقبال الـ Webhook من Chiron
app.post('/chiron/webhook', (req, res) => {
  console.log('Data ontvangen van Chiron:', req.body);
  res.status(200).json({ status: 'ok', bericht: 'Webhook ontvangen' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
