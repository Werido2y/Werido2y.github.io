import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaStethoscope, FaListAlt, FaPrescription, FaChartLine, FaCamera, FaUpload, FaTimes, FaFileImage } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginModal from './components/Auth/LoginModal';
import RegisterModal from './components/Auth/RegisterModal';
import PatientInfoForm from './components/PatientInfo/PatientInfoForm';
import DiagnosisModule from './components/Diagnosis/DiagnosisModule';
import SyndromeAnalysisForm from './components/Diagnosis/SyndromeAnalysis';
import TreatmentRecommendation from './components/Treatment/TreatmentRecommendation';
import FollowUpModule from './components/FollowUp/FollowUpModule';
import { authService } from './api/authService';
import { User } from './types/auth';
import { SyndromeAnalysis, DiagnosisResult } from './types/diagnosis';
import logoImage from './assets/logo.png';
import './styles/global.css';

function App() {
  const [selectedMenu, setSelectedMenu] = useState('病人信息');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { id: '病人信息', icon: <FaUser />, label: '病人信息' },
    { id: '疾病诊断', icon: <FaStethoscope />, label: '疾病诊断' },
    { id: '辨证分型', icon: <FaListAlt />, label: '辨证分型' },
    { id: '推荐诊疗方案', icon: <FaPrescription />, label: '推荐诊疗方案' },
    { id: '预后随访', icon: <FaChartLine />, label: '预后随访' },
  ];

  const mockDiagnosisResults: DiagnosisResult[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      disease: 'psoriasis',
      confidence: 92,
      details: {
        symptoms: [
          '红斑：境界清楚的红色斑块，常见于头皮、肘部、膝部、骶尾部等处',
          '鳞屑：覆盖大量银白色鳞屑，轻轻刮除后可见点状出血（Auspitz征）',
          '薄膜现象：鳞屑下有一层半透明的薄膜',
          '瘙痒：部分患者伴有轻至中度瘙痒'
        ],
        severity: 'moderate',
        affectedAreas: ['头皮', '肘部', '膝部', '骶尾部'],
        recommendations: ['建议及时就医', '保持皮肤清洁和保湿', '避免刺激和过度搔抓']
      },
      imageUrls: []
    }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }

    const files = e.dataTransfer.files;
    await processFiles(Array.from(files));
  };

  const processFiles = async (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.match('image.*') && 
      file.size <= 10 * 1024 * 1024
    );
    
    if (validFiles.length === 0) {
      toast.error('没有有效的图片文件，请确保文件为图片格式且大小不超过10MB');
      return;
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    // 模拟上传进度
    setUploadProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }
    
    // 随机选择一个模拟诊断结果
    const mockResult = { ...mockDiagnosisResults[0] };
    mockResult.imageUrls = validFiles.map(file => URL.createObjectURL(file));
    setDiagnosisResult(mockResult);
    
    // 重置进度条
    setTimeout(() => {
      setUploadProgress(0);
    }, 1000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }

    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleLogin = async (identifier: string, password: string, rememberMe: boolean) => {
    try {
      const user = await authService.login({ identifier, password });
      setIsLoggedIn(true);
      setUser(user);
      setIsLoginOpen(false);
      toast.success('登录成功！');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '登录失败，请重试');
    }
  };

  const handleRegister = async (email: string, password: string, name: string, phone: string) => {
    try {
      const registeredUser = await authService.register({ email, password, name, phone });
      setUser(registeredUser);
      setIsLoggedIn(true);
      setIsRegisterOpen(false);
      toast.success('注册成功！');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '注册失败，请重试');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
    toast.info('已退出登录');
  };

  const handleSyndromeAnalysisSubmit = (analysis: SyndromeAnalysis) => {
    // TODO: 将来添加与后端API的集成
    console.log('Syndrome Analysis:', analysis);
    toast.success('评分提交成功！');
  };

  const handleResetDiagnosis = () => {
    setDiagnosisResult(null);
    setUploadedFiles([]);
    setUploadProgress(0);
    // 重置文件输入框
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case '病人信息':
        return <PatientInfoForm />;
      case '疾病诊断':
        return (
          <div className="space-y-6">
            {isLoggedIn ? (
              <div className="mt-8 flex flex-col items-center">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">点击上传医学影像</h3>
                  <p className="mt-1 text-sm text-gray-500">支持JPG、PNG格式，单个文件不超过10MB</p>
                </div>
                
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                  <div className="w-32 h-32 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-amber-500 transition-colors">
                    <FaCamera className="w-12 h-12 mb-2 text-amber-500" />
                    <span className="text-gray-500 text-sm">点击上传医学影像</span>
                  </div>
                </label>

                {/* 上传进度条 */}
                {uploadProgress > 0 && (
                  <div className="mt-4 w-full max-w-md">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* 诊断结果 */}
                {diagnosisResult && (
                  <div className="mt-8 w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-xl font-medium text-gray-900 mb-4">
                      根据皮损图片特征诊断为银屑病
                      <span className="ml-2 text-sm text-amber-600">
                        置信度：{diagnosisResult.confidence}%
                      </span>
                    </h4>
                    
                    <div className="space-y-4">
                      <h5 className="text-lg font-medium text-gray-900">常见临床表现</h5>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {diagnosisResult.details.symptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-6">
                        <h5 className="text-lg font-medium text-gray-900 mb-3">上传的图片</h5>
                        <div className="flex justify-center">
                          <div className="max-w-xl w-full">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="relative mb-4">
                                <div className="flex justify-center">
                                  <div className="relative max-w-md w-full">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`上传图片 ${index + 1}`}
                                      className="w-full h-auto rounded-lg shadow-md object-contain"
                                      style={{ maxHeight: '500px' }}
                                    />
                                    <button
                                      onClick={() => removeFile(index)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                    >
                                      <FaTimes className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 重新诊断按钮 */}
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={handleResetDiagnosis}
                        className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors flex items-center space-x-2"
                      >
                        <FaCamera className="h-4 w-4" />
                        <span>重新诊断</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">请先登录</h3>
                  <p className="mt-1 text-sm text-gray-500">登录后即可使用疾病诊断功能</p>
                </div>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                >
                  立即登录
                </button>
              </div>
            )}
          </div>
        );
      case '辨证分型':
        return <SyndromeAnalysisForm onSubmit={handleSyndromeAnalysisSubmit} />;
      case '推荐诊疗方案':
        return <TreatmentRecommendation />;
      case '预后随访':
        return <FollowUpModule />;
      default:
        return <div>功能开发中...</div>;
    }
  };

  useEffect(() => {
    // 检查初始登录状态
    setIsLoggedIn(authService.isAuthenticated());
    setUser(authService.getUser());

    // 添加存储事件监听器
    const handleStorageChange = () => {
      setIsLoggedIn(authService.isAuthenticated());
      setUser(authService.getUser());
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 清理函数
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuth = authService.isAuthenticated();
      setIsLoggedIn(isAuth);
      if (!isAuth) {
        setUser(null);
      }
    };

    // 初始检查
    checkAuthStatus();

    // 每分钟检查一次登录状态
    const interval = setInterval(checkAuthStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img src={logoImage} alt="Logo" className="h-12 w-auto" />
            <h1 className="text-2xl font-bold text-primary">中医智能辅助诊断系统</h1>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-6 py-2.5 bg-cream-color text-secondary hover:bg-light-brown hover:text-primary transition-colors duration-300 rounded-lg font-medium shadow-md hover:shadow-lg border-2 border-secondary"
                >
                  登录
                </button>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-6 py-2.5 bg-secondary text-cream-color hover:bg-primary hover:text-white transition-colors duration-300 rounded-lg font-medium shadow-md hover:shadow-lg"
                >
                  注册
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-primary font-medium">欢迎，{user?.name}</span>
                <button
                  onClick={() => {
                    authService.logout();
                    setIsLoggedIn(false);
                    setUser(null);
                  }}
                  className="px-6 py-2.5 bg-danger-color text-cream-color hover:bg-red-900 hover:text-white transition-colors duration-300 rounded-lg font-medium shadow-md hover:shadow-lg"
                >
                  退出
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <div className="side-menu">
              {menuItems.map(item => (
                <div
                  key={item.id}
                  className={`menu-item ${selectedMenu === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedMenu(item.id)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </div>
              ))}
            </div>
          </aside>

          <main className="flex-1">
            <div className={`upload-area ${isDragging ? 'border-primary bg-white' : ''}`}
                 onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                 onDrop={handleDrop}>
              {renderContent()}
            </div>
          </main>
        </div>

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLogin}
        />
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onRegister={handleRegister}
        />

        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
}

export default App;