const express = require('express');
const cors = require('cors');
const app = express();

// تفعيل CORS ليعمل الربط مع الواجهة بدون حظر
app.use(cors());
app.use(express.json());

// 1. الصفحة الرئيسية لتأكيد عمل السيرفر
app.get('/', (req, res) => {
  res.send('Chiron backend draait correct ✅');
});

// 2. Endpoint لاستقبال بيانات الرحلات من الواجهة
app.post('/chiron/verzoek', async (req, res) => {
  try {
    const tripData = req.body;
    console.log('Data ontvangen van frontend:', tripData);

    // استجابة النجاح المباشرة للواجهة
    res.status(200).json({
      status: 'SUCCESS',
      bericht: 'Rit succesvol verwerkt door Chiron Backend',
      receivedData: tripData
    });
  } catch (error) {
    console.error('Error in Chiron request:', error);
    res.status(500).json({ status: 'ERROR', bericht: 'Er is een fout opgetreden' });
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
