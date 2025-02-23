import React, { useState } from 'react';
import { Card, Typography, Upload, message, Spin, Descriptions, Tag, List, Alert } from 'antd';
import { CameraOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DiagnosisResult } from '../../types/diagnosis';
import type { UploadProps } from 'antd';
import { diagnosisService } from '../../api/diagnosisService';

const { Title, Text, Paragraph } = Typography;

interface DiagnosisModuleProps {
  userId?: string;
  onDiagnosisComplete?: (result: DiagnosisResult) => void;
}

const DiagnosisModule: React.FC<DiagnosisModuleProps> = ({ userId, onDiagnosisComplete }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadProps: UploadProps = {
    name: 'image',
    multiple: false,
    showUploadList: false,
    accept: 'image/jpeg,image/png',
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('请上传JPG或PNG格式的图片');
        return Upload.LIST_IGNORE;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('图片大小不能超过10MB');
        return Upload.LIST_IGNORE;
      }
      setSelectedImage(file);
      // 创建预览URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      handleDiagnosis(file);
      return false;
    },
  };

  const handleDiagnosis = async (file: File) => {
    if (!userId) {
      message.error('请先登录后再进行诊断');
      return;
    }

    try {
      setIsLoading(true);
      setDiagnosisResult(null);
      const result = await diagnosisService.diagnoseImage(file, userId);
      setDiagnosisResult(result);
      onDiagnosisComplete?.(result);
    } catch (error) {
      console.error('诊断失败:', error);
      message.error('诊断失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="diagnosis-module" style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Card style={{ border: '1px dashed #d9d9d9', background: '#fafafa' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Upload.Dragger 
            {...uploadProps}
            style={{ 
              padding: '20px',
              background: 'transparent',
              border: 'none',
              width: '100%',
              maxWidth: 400
            }}
          >
            <div style={{ padding: '20px 0' }}>
              <p className="upload-icon" style={{ marginBottom: 20 }}>
                <CameraOutlined style={{ fontSize: 48, color: '#e67e22' }} />
              </p>
              <Title level={4} style={{ marginBottom: 8, color: '#2c3e50' }}>
                点击上传医学影像
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                支持JPG、PNG格式，单个文件不超过10MB
              </Text>
            </div>
          </Upload.Dragger>

          {selectedImage && (
            <div style={{ 
              width: '100%',
              maxWidth: '500px',
              marginTop: '24px',
              textAlign: 'center'
            }}>
              <div style={{
                backgroundColor: '#fff',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="上传图片"
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">正在分析图片，请稍候...</Text>
          </div>
        </div>
      )}

      {diagnosisResult && (
        <Card
          style={{ marginTop: 24 }}
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
              <span>诊断结果</span>
              <Tag color="blue" style={{ marginLeft: 12 }}>
                置信度: {diagnosisResult.confidence}%
              </Tag>
            </div>
          }
        >
          <div>
            <Title level={5} style={{ marginBottom: 16 }}>根据皮损图片特征诊断为银屑病</Title>
            
            <div style={{ marginBottom: 24 }}>
              <Title level={5}>常见临床表现</Title>
              <List
                size="small"
                dataSource={[
                  '红斑：境界不清的红斑，常见于面部、颈部、肘窝、膝窝等处',
                  '丘疹和水疱：早期皮损可出现丘疹和小水疱',
                  '渗出和结痂：急性期皮损可有浆液渗出，干燥后形成痂皮',
                  '苔藓样变：慢性期皮损表现为皮肤增厚、粗糙、类似苔藓',
                  '瘙痒：剧烈瘙痒是特应性皮炎的主要症状'
                ]}
                renderItem={item => (
                  <List.Item>
                    <Text>{item}</Text>
                  </List.Item>
                )}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>建议</Title>
              <List
                size="small"
                dataSource={[
                  '避免接触过敏原和刺激物',
                  '保持皮肤清洁和适度湿润',
                  '使用医生推荐的外用药物',
                  '避免用手抓挠患处',
                  '穿着宽松、透气的衣物',
                  '保持良好的作息习惯，避免熬夜'
                ]}
                renderItem={item => (
                  <List.Item>
                    <Text>{item}</Text>
                  </List.Item>
                )}
              />
            </div>

            <Alert
              type="warning"
              showIcon
              message="温馨提示"
              description="以上诊断结果仅供参考，建议及时就医进行专业的医学诊断和治疗。"
              style={{ marginTop: 16 }}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default DiagnosisModule;
