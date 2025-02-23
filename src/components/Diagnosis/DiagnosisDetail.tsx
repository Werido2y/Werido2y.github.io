import React from 'react';
import { DiagnosisResult } from '../../types/diagnosis';

interface DiagnosisDetailProps {
  diagnosis: DiagnosisResult;
}

const DiagnosisDetail: React.FC<DiagnosisDetailProps> = ({ diagnosis }) => {
  const { disease, confidence, details } = diagnosis;
  const { symptoms, severity, affectedAreas, recommendations } = details;

  // 将疾病名称转换为中文
  const diseaseNameMap: Record<string, string> = {
    'psoriasis': '银屑病',
    'eczema': '湿疹',
    'unknown': '未知'
  };

  // 将严重程度转换为中文
  const severityMap = {
    'mild': '轻度',
    'moderate': '中度',
    'severe': '重度'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-2xl font-semibold text-gray-800">
          诊断结果
        </h3>
        <div className="mt-2 flex items-center">
          <span className="text-lg font-medium text-gray-700">
            {diseaseNameMap[disease]}
          </span>
          <span className="ml-3 px-3 py-1 rounded-full text-sm" 
            style={{
              backgroundColor: confidence > 80 ? '#dcfce7' : confidence > 60 ? '#fef9c3' : '#fee2e2',
              color: confidence > 80 ? '#166534' : confidence > 60 ? '#854d0e' : '#991b1b'
            }}>
            置信度 {confidence}%
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">严重程度</h4>
          <p className="text-gray-600">{severityMap[severity]}</p>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">症状表现</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {symptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">受影响部位</h4>
          <div className="flex flex-wrap gap-2">
            {affectedAreas.map((area, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                {area}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">建议</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t">
        <p className="text-sm text-gray-500">
          注意：此诊断结果仅供参考，请务必咨询专业医生进行进一步诊断和治疗。
        </p>
      </div>
    </div>
  );
};

export default DiagnosisDetail;
