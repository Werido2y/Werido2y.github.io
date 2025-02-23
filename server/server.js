import express from 'express';
import cors from 'cors';
import axios from 'axios';
import multer from 'multer';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
config({ path: join(__dirname, '..', '.env') });

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 图像诊断接口
app.post('/api/diagnosis/image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'No image file provided'
    });
  }

  if (!process.env.VITE_DEEPSEEK_API_KEY) {
    console.error('Deepseek API key not found in environment variables');
    return res.status(500).json({
      error: 'Server configuration error',
      details: 'API key not configured'
    });
  }

  try {
    // 构建提示词
    const prompt = `请分析这张皮肤病图片，判断是否为银屑病或特应性皮炎。请详细描述观察到的症状，并给出诊断结果。
    要求：
    1. 列出观察到的主要症状
    2. 给出诊断结果（银屑病/特应性皮炎/无法确定）
    3. 给出确信度（0-100%）
    4. 如果可能，指出受影响的身体部位
    5. 给出相关建议`;

    // 将图片转换为base64
    const base64Image = req.file.buffer.toString('base64');

    // 调用 Deepseek API 进行诊断
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: "deepseek-vision",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${req.file.mimetype};base64,${base64Image}`
              }
            }
          ]
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.VITE_DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // 解析 AI 响应
    const aiResponse = response.data.choices[0].message.content;
    
    // 解析诊断结果
    let disease = 'unknown';
    let confidence = 0;
    
    if (aiResponse.toLowerCase().includes('银屑病')) {
      disease = 'psoriasis';
      // 从响应中提取置信度
      const confidenceMatch = aiResponse.match(/确信度[：:]\s*(\d+)/);
      confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 70;
    } else if (aiResponse.toLowerCase().includes('特应性皮炎')) {
      disease = 'specific_dermatitis';
      const confidenceMatch = aiResponse.match(/确信度[：:]\s*(\d+)/);
      confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 70;
    }

    // 返回诊断结果
    res.json({
      disease,
      confidence,
      aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Deepseek API error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Diagnosis failed',
      details: error.message
    });
  }
});

// Deepseek API proxy endpoint
app.post('/api/deepseek/chat', async (req, res) => {
  if (!process.env.VITE_DEEPSEEK_API_KEY) {
    console.error('Deepseek API key not found in environment variables');
    return res.status(500).json({
      error: 'Server configuration error',
      details: 'API key not configured'
    });
  }

  try {
    console.log('Received request to Deepseek API');
    const response = await axios.post(
      'https://api.deepseek.cloud/v1/chat/completions',
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${process.env.VITE_DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );
    console.log('Deepseek API response received');
    res.json(response.data);
  } catch (error) {
    console.error('Deepseek API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'Gateway Timeout',
        details: 'Request to Deepseek API timed out'
      });
    }

    if (!error.response) {
      return res.status(502).json({
        error: 'Bad Gateway',
        details: 'Could not connect to Deepseek API'
      });
    }

    res.status(error.response.status || 500).json({
      error: 'Failed to process request',
      details: error.response?.data || error.message
    });
  }
});

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${port}`);
  console.log(`Deepseek API Key: ${process.env.VITE_DEEPSEEK_API_KEY ? 'Found' : 'Not found'}`);
});
