import React from 'react';
import { Card, Collapse, List, Typography } from 'antd';
import { Treatment } from '../../types/diagnosis';

const { Panel } = Collapse;
const { Title, Text } = Typography;

const treatments: Treatment[] = [
  {
    syndrome: '血热证',
    principle: '凉血潜阳',
    prescription: {
      name: '决银颗粒',
      medicines: [
        { name: '石决明', amount: '30g' },
        { name: '金银花', amount: '15g' },
        { name: '丹皮', amount: '15g' },
        { name: '生地', amount: '30g' },
        { name: '白花蛇舌草', amount: '30g' },
        { name: '大青叶', amount: '30g' },
        { name: '郁金', amount: '9g' },
      ]
    },
    usage: '将每袋药物加入开水约 50 毫升，搅拌至颗粒基本溶解，再加适量温水稀释，每日 2 次温服'
  },
  {
    syndrome: '血瘀证',
    principle: '活血化瘀',
    prescription: {
      name: '桃丹颗粒',
      medicines: [
        { name: '黄芪', amount: '15g' },
        { name: '炙甘草', amount: '10g' },
        { name: '当归', amount: '15g' },
        { name: '川芎', amount: '10g' },
        { name: '桃仁', amount: '10g' },
        { name: '丹参', amount: '30g' },
        { name: '莪术', amount: '30g' },
        { name: '川牛膝', amount: '15g' },
        { name: '菝葜', amount: '30g' },
      ]
    },
    usage: '将每袋药物加入开水约 50 毫升，搅拌至颗粒基本溶解，再加适量温水稀释，每日 2 次温服'
  },
  {
    syndrome: '血燥证',
    principle: '养血润燥',
    prescription: {
      name: '养血解毒颗粒',
      medicines: [
        { name: '丹参', amount: '15g' },
        { name: '当归', amount: '15g' },
        { name: '生地黄', amount: '15g' },
        { name: '麦冬', amount: '10g' },
        { name: '玄参', amount: '15g' },
        { name: '鸡血藤', amount: '15g' },
        { name: '土茯苓', amount: '30g' },
        { name: '重楼', amount: '9g' },
        { name: '板蓝根', amount: '15g' },
        { name: '车前子', amount: '15g' },
      ]
    },
    usage: '将每袋药物加入开水约 50 毫升，搅拌至颗粒基本溶解，再加适量温水稀释，每日 2 次温服'
  }
];

const TreatmentRecommendation: React.FC = () => {
  // Find the index of the blood stasis syndrome
  const bloodStasisIndex = treatments.findIndex(t => t.syndrome === '血瘀证');
  
  return (
    <div className="p-4">
      <Title level={3} className="mb-6">推荐诊疗方案</Title>
      <Collapse defaultActiveKey={[String(bloodStasisIndex)]}>
        {treatments.map((treatment, index) => (
          <Panel 
            header={`${treatment.syndrome}推荐治法方药`} 
            key={index}
          >
            <Card bordered={false}>
              <div className="space-y-4">
                <div>
                  <Text strong className="text-lg">基本治则：</Text>
                  <Text className="ml-2">{treatment.principle}</Text>
                </div>
                
                <div>
                  <Text strong className="text-lg">治疗：</Text>
                  <div className="ml-2">
                    <Text>{treatment.prescription.name}</Text>
                    <List
                      dataSource={treatment.prescription.medicines}
                      renderItem={item => (
                        <List.Item className="py-1">
                          <Text>{item.name} {item.amount}</Text>
                        </List.Item>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Text strong className="text-lg">煎服法：</Text>
                  <Text className="ml-2">{treatment.usage}</Text>
                </div>
              </div>
            </Card>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default TreatmentRecommendation;
