import React from 'react';
import qrCodeImage from '../../assets/qrcode.png';

const FollowUpModule: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">预约随访</h2>
        <p className="text-gray-600">微信扫描二维码自助预约</p>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        <div className="w-64 h-64 bg-white p-4 rounded-lg shadow-inner">
          <img
            src={qrCodeImage}
            alt="预约二维码"
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            扫描上方二维码，即可在线预约随访时间
          </p>
          <p className="text-sm text-gray-500 mt-2">
            预约成功后，我们会通过微信提醒您具体时间
          </p>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModule;
