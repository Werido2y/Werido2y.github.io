import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (identifier: string, password: string, rememberMe: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phone: string) => {
    const phoneRegex = /^1[2-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const trimmed = numbers.substring(0, 11);
    
    if (trimmed.length <= 3) {
      return trimmed;
    } else if (trimmed.length <= 7) {
      return `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
    } else {
      return `${trimmed.slice(0, 3)}-${trimmed.slice(3, 7)}-${trimmed.slice(7)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormattedPhone(formatted);
    
    const rawPhone = formatted.replace(/-/g, '');
    setIdentifier(rawPhone);
    
    if (rawPhone.length === 11) {
      if (!validatePhone(rawPhone)) {
        setPhoneError('请输入有效的手机号码');
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginType === 'phone') {
      const rawPhone = identifier;
      if (!validatePhone(rawPhone)) {
        setPhoneError('请输入有效的手机号码');
        return;
      }
    }
    
    onLogin(identifier, password, rememberMe);
    onClose();
  };

  if (!isOpen) return null;

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleModalClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-900">用户登录</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setLoginType('email');
                setFormattedPhone('');
                setIdentifier('');
                setPhoneError('');
              }}
              className={`flex-1 py-2 rounded-md transition-colors ${
                loginType === 'email'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              邮箱登录
            </button>
            <button
              type="button"
              onClick={() => setLoginType('phone')}
              className={`flex-1 py-2 rounded-md transition-colors ${
                loginType === 'phone'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              手机登录
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {loginType === 'email' ? '邮箱地址' : '手机号码'}
            </label>
            {loginType === 'email' ? (
              <input
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            ) : (
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={formattedPhone}
                  onChange={handlePhoneChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    phoneError ? 'border-red-500' : ''
                  }`}
                  placeholder="136-3634-4175"
                  required
                />
                {formattedPhone && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormattedPhone('');
                      setIdentifier('');
                      setPhoneError('');
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700 transition-colors"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
