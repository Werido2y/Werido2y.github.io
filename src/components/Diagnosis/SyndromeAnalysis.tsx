import React, { useState } from 'react';
import { Tabs, Form, Input, Card, Space, Button, Modal, Image, Alert, List, Typography, Divider, Tag } from 'antd';
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Props {
  onSubmit: (values: any) => void;
}

interface ReferenceTableProps {
  title: string;
  imageSrc: string;
  visible: boolean;
  onClose: () => void;
}

const ReferenceTable: React.FC<ReferenceTableProps> = ({ title, imageSrc, visible, onClose }) => {
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Image
        src={imageSrc}
        alt={title}
        style={{ width: '100%' }}
      />
    </Modal>
  );
};

// 可点击的标签组件
const ClickableLabel: React.FC<{
  label: string;
  onClick: () => void;
}> = ({ label, onClick }) => (
  <span
    onClick={onClick}
    style={{
      cursor: 'pointer',
      color: '#1890ff',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }}
  >
    {label}
    <QuestionCircleOutlined style={{ fontSize: '14px' }} />
  </span>
);

interface SyndromeResult {
  type: string;
  description: string;
  symptoms: string[];
  treatment: string[];
  recommendations: string[];
}

const bloodStasisSyndrome: SyndromeResult = {
  type: '血瘀证',
  description: '血瘀证是中医辨证分型中的一种证型，主要表现为血液运行不畅，瘀滞于体内所致的一系列症候。',
  symptoms: [
    '皮损颜色紫暗',
    '皮损固定不移',
    '皮损反复发作',
    '瘙痒或刺痛',
    '舌质紫暗或有瘀点',
    '脉象涩或细涩'
  ],
  treatment: [
    '活血化瘀',
    '行气止痛',
    '养血通络'
  ],
  recommendations: [
    '保持情绪稳定，避免精神紧张',
    '适当运动，促进血液循环',
    '避免辛辣刺激性食物',
    '保持作息规律，避免熬夜',
    '可配合中药外敷治疗'
  ]
};

const SyndromeAnalysisForm: React.FC<Props> = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [visibleTable, setVisibleTable] = useState<string | null>(null);
  const [syndromeResult, setSyndromeResult] = useState<SyndromeResult | null>(null);
  const [formValues, setFormValues] = useState<any>(null);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setFormValues(values);
      setSyndromeResult(bloodStasisSyndrome);
      onSubmit(values);
    });
  };

  const showReferenceTable = (tableType: string) => {
    setVisibleTable(tableType);
  };

  const closeReferenceTable = () => {
    setVisibleTable(null);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Form form={form} layout="vertical">
        <Card>
          <Tabs defaultActiveKey="fourDiagnosis">
            <Tabs.TabPane tab="四诊" key="fourDiagnosis">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item label="舌象" name="tongue_diagnosis">
                  <Input.TextArea
                    placeholder="请描述舌象（如：舌质、舌苔等）"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                  />
                </Form.Item>
                <Form.Item label="脉象" name="pulse_diagnosis">
                  <Input.TextArea
                    placeholder="请描述脉象"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                  />
                </Form.Item>
              </Space>
            </Tabs.TabPane>

            <Tabs.TabPane tab="临床指标" key="clinical">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item 
                  label={
                    <ClickableLabel
                      label="PASI评分"
                      onClick={() => showReferenceTable('pasi')}
                    />
                  }
                  name="pasi_score"
                  rules={[{ required: true, message: '请输入PASI评分' }]}
                >
                  <Input placeholder="请输入PASI评分" />
                </Form.Item>
                <Form.Item
                  label={
                    <ClickableLabel
                      label="皮损体表面积(BSA)"
                      onClick={() => showReferenceTable('bsa')}
                    />
                  }
                  name="bsa_score"
                  rules={[{ required: true, message: '请输入BSA评分' }]}
                >
                  <Input placeholder="请输入BSA评分" />
                </Form.Item>
              </Space>
            </Tabs.TabPane>

            <Tabs.TabPane tab="实验室指标" key="laboratory">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item label="SCCA" name="scca" rules={[{ required: true, message: '请输入SCCA值' }]}>
                  <Input placeholder="请输入SCCA值" />
                </Form.Item>
                <Form.Item label="TNF-α" name="tnf_alpha">
                  <Input placeholder="请输入TNF-α值" />
                </Form.Item>
                <Form.Item label="IL-23" name="il_23">
                  <Input placeholder="请输入IL-23值" />
                </Form.Item>
                <Form.Item label="IL-17" name="il_17">
                  <Input placeholder="请输入IL-17值" />
                </Form.Item>
              </Space>
            </Tabs.TabPane>

            <Tabs.TabPane tab="主观指标" key="subjective">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item 
                  label={
                    <ClickableLabel
                      label="VAS评分"
                      onClick={() => showReferenceTable('vas')}
                    />
                  }
                  name="vas"
                >
                  <Input placeholder="请输入VAS评分" />
                </Form.Item>
                <Form.Item 
                  label={
                    <ClickableLabel
                      label="DLQI评分"
                      onClick={() => showReferenceTable('dlqi')}
                    />
                  }
                  name="dlqi"
                  rules={[{ required: true, message: '请输入DLQI评分' }]}
                >
                  <Input placeholder="请输入DLQI评分" />
                </Form.Item>
                <Form.Item 
                  label={
                    <ClickableLabel
                      label="CSS评分"
                      onClick={() => showReferenceTable('css')}
                    />
                  }
                  name="css"
                >
                  <Input placeholder="请输入CSS评分" />
                </Form.Item>
                <Form.Item 
                  label={
                    <ClickableLabel
                      label="SAS评分"
                      onClick={() => showReferenceTable('sas')}
                    />
                  }
                  name="sas"
                >
                  <Input placeholder="请输入SAS评分" />
                </Form.Item>
                <Form.Item 
                  label={
                    <ClickableLabel
                      label="SDS评分"
                      onClick={() => showReferenceTable('sds')}
                    />
                  }
                  name="sds"
                >
                  <Input placeholder="请输入SDS评分" />
                </Form.Item>
                <Form.Item 
                  label={
                    <ClickableLabel
                      label="XQ评分"
                      onClick={() => showReferenceTable('xq')}
                    />
                  }
                  name="xq"
                >
                  <Input placeholder="请输入XQ评分" />
                </Form.Item>
                <Form.Item 
                  label={
                    <ClickableLabel
                      label="CMSSS评分"
                      onClick={() => showReferenceTable('cmsss')}
                    />
                  }
                  name="cmsss"
                  rules={[{ required: true, message: '请输入CMSSS评分' }]}
                >
                  <Input placeholder="请输入CMSSS评分" />
                </Form.Item>
              </Space>
            </Tabs.TabPane>
          </Tabs>
        </Card>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button type="primary" onClick={handleSubmit}>
            辨证分析
          </Button>
        </div>
      </Form>

      {formValues && syndromeResult && (
        <Card style={{ marginTop: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={4}>{syndromeResult.type}辨证分析报告</Title>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>关键指标</Title>
            <List
              size="small"
              dataSource={[
                { label: 'CMSSS评分', value: formValues.cmsss },
                { label: 'DLQI评分', value: formValues.dlqi },
                { label: 'BSA评分', value: formValues.bsa_score },
                { label: 'PASI评分', value: formValues.pasi_score },
                { label: 'SCCA值', value: formValues.scca }
              ]}
              renderItem={item => (
                <List.Item>
                  <Text strong>{item.label}：</Text>
                  <Text>{item.value}</Text>
                </List.Item>
              )}
            />
          </div>

          <Divider />

          <Alert
            message="证型说明"
            description={syndromeResult.description}
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            style={{ marginBottom: 24 }}
          />

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>主要表现</Title>
            <List
              size="small"
              dataSource={syndromeResult.symptoms}
              renderItem={item => (
                <List.Item>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>治疗原则</Title>
            <Space size={[0, 8]} wrap>
              {syndromeResult.treatment.map((item, index) => (
                <Tag key={index} color="blue">{item}</Tag>
              ))}
            </Space>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>调护建议</Title>
            <List
              size="small"
              dataSource={syndromeResult.recommendations}
              renderItem={item => (
                <List.Item>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </div>

          <Alert
            message="温馨提示"
            description="以上辨证分析结果仅供参考，建议在专业中医师指导下进行规范治疗。"
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Card>
      )}

      <ReferenceTable
        title="PASI评分参考表"
        imageSrc={import.meta.env.BASE_URL + 'images/pasi-reference.png'}
        visible={visibleTable === 'pasi'}
        onClose={closeReferenceTable}
      />
      <ReferenceTable
        title="BSA评分参考表"
        imageSrc={import.meta.env.BASE_URL + 'images/bsa-reference.png'}
        visible={visibleTable === 'bsa'}
        onClose={closeReferenceTable}
      />
      <ReferenceTable
        title="VAS评分参考表"
        imageSrc={import.meta.env.BASE_URL + 'images/VAS-reference.png'}
        visible={visibleTable === 'vas'}
        onClose={closeReferenceTable}
      />
      <ReferenceTable
        title="DLQI评分参考表"
        imageSrc={import.meta.env.BASE_URL + 'images/DLQI-reference.png'}
        visible={visibleTable === 'dlqi'}
        onClose={closeReferenceTable}
      />
      <ReferenceTable
        title="SAS评分参考表"
        imageSrc={import.meta.env.BASE_URL + 'images/SAS-reference.png'}
        visible={visibleTable === 'sas'}
        onClose={closeReferenceTable}
      />
      <ReferenceTable
        title="SDS评分参考表"
        imageSrc={import.meta.env.BASE_URL + 'images/SDS-reference.png'}
        visible={visibleTable === 'sds'}
        onClose={closeReferenceTable}
      />
      <ReferenceTable
        title="XQ评分参考表"
        imageSrc={import.meta.env.BASE_URL + 'images/XQ-reference.png'}
        visible={visibleTable === 'xq'}
        onClose={closeReferenceTable}
      />
      <ReferenceTable
        title="CSS评分参考表"
        imageSrc={import.meta.env.BASE_URL + 'images/CSS-reference.png'}
        visible={visibleTable === 'css'}
        onClose={closeReferenceTable}
      />
      <ReferenceTable
        title="CMSSS评分参考表"
        imageSrc={import.meta.env.BASE_URL + 'images/CMSSS-reference.png'}
        visible={visibleTable === 'cmsss'}
        onClose={closeReferenceTable}
      />
    </div>
  );
};

export default SyndromeAnalysisForm;
