import React from 'react';
import { DiagnosisHistoryItem } from '../../types/diagnosis';
import { format } from 'date-fns';
import { FiClock, FiThermometer, FiList } from 'react-icons/fi';

interface DiagnosisHistoryProps {
  history: DiagnosisHistoryItem[];
  onSelectHistory: (item: DiagnosisHistoryItem) => void;
}

const DiagnosisHistory: React.FC<DiagnosisHistoryProps> = ({
  history,
  onSelectHistory,
}) => {
  const getSeverityColor = (severity: 'mild' | 'moderate' | 'severe') => {
    switch (severity) {
      case 'mild':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">诊断历史记录</h3>
      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-4">暂无诊断记录</p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 hover:border-amber-500 cursor-pointer transition-colors"
              onClick={() => onSelectHistory(item)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">
                    {item.disease === 'psoriasis' ? '银屑病' : '特应性皮炎'}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(
                      item.severity
                    )}`}
                  >
                    {item.severity === 'mild'
                      ? '轻度'
                      : item.severity === 'moderate'
                      ? '中度'
                      : '重度'}
                  </span>
                </div>
                <span className="text-sm text-gray-500 flex items-center">
                  <FiClock className="mr-1" />
                  {format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm')}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <FiThermometer className="mr-1" />
                置信度：{Math.round(item.confidence * 100)}%
              </div>
              <div className="flex items-start text-sm text-gray-600">
                <FiList className="mr-1 mt-1 flex-shrink-0" />
                <div>
                  主要症状：
                  {item.details.symptoms.slice(0, 2).join('、')}
                  {item.details.symptoms.length > 2 && '...'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiagnosisHistory;
