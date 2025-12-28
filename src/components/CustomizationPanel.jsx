import React, { useRef } from 'react';

const CustomizationPanel = ({ 
  onEarTextureChange, 
  onCharacterCustomizationChange, 
  onEarImageUpload, 
  onCharacterImageUpload,
  earTexture, 
  characterCustomization,
  earImageUrl,
  characterImageUrl
}) => {
  const earFileInputRef = useRef(null);
  const characterFileInputRef = useRef(null);
  // 预设的猫耳贴图
  const earTextures = [
    { id: 'default', name: '默认猫耳', color: '#ffccaa', innerColor: '#ff9966' },
    { id: 'pink', name: '粉色猫耳', color: '#ffb6c1', innerColor: '#ff69b4' },
    { id: 'black', name: '黑色猫耳', color: '#333333', innerColor: '#666666' },
    { id: 'white', name: '白色猫耳', color: '#ffffff', innerColor: '#cccccc' },
    { id: 'blue', name: '蓝色猫耳', color: '#add8e6', innerColor: '#4682b4' }
  ];

  // 角色自定义选项
  const characterOptions = {
    hairColor: ['#333333', '#ff6b9d', '#4a90e2', '#f1c40f', '#e74c3c'],
    eyeColor: ['#4a90e2', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6'],
    outfitColor: ['#ff6b9d', '#4a90e2', '#e74c3c', '#2ecc71', '#9b59b6']
  };

  // 处理猫耳图片上传
  const handleEarImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onEarImageUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理角色图片上传
  const handleCharacterImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onCharacterImageUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 触发文件选择对话框
  const triggerEarFileInput = () => {
    earFileInputRef.current.click();
  };

  const triggerCharacterFileInput = () => {
    characterFileInputRef.current.click();
  };

  return (
    <div className="customization-panel">
      <h3>自定义选项</h3>
      
      {/* 猫耳贴图自定义 */}
      <div className="customization-section">
        <h4>猫耳样式</h4>
        
        {/* 自定义图片上传 */}
        <div className="upload-section">
          <button className="upload-button" onClick={triggerEarFileInput}>
            上传自定义猫耳图片
          </button>
          <input 
            type="file" 
            ref={earFileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleEarImageUpload}
          />
          
          {/* 猫耳图片预览 */}
          {earImageUrl && (
            <div className="image-preview-container">
              <h5>当前猫耳图片：</h5>
              <img 
                src={earImageUrl} 
                alt="自定义猫耳" 
                className="preview-image"
              />
            </div>
          )}
        </div>
        
        <div className="texture-options">
          {earTextures.map(texture => (
            <div 
              key={texture.id}
              className={`texture-option ${earTexture.id === texture.id ? 'active' : ''}`}
              onClick={() => onEarTextureChange(texture)}
              style={{
                backgroundColor: texture.color,
                border: `3px solid ${earTexture.id === texture.id ? '#ffffff' : 'transparent'}`
              }}
            >
              <div className="texture-preview" style={{
                backgroundColor: texture.innerColor
              }}></div>
              <span>{texture.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* 动漫女生模型自定义 */}
      <div className="customization-section">
        <h4>角色外观</h4>
        
        {/* 自定义角色图片上传 */}
        <div className="upload-section">
          <button className="upload-button" onClick={triggerCharacterFileInput}>
            上传自定义角色图片
          </button>
          <input 
            type="file" 
            ref={characterFileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleCharacterImageUpload}
          />
          
          {/* 角色图片预览 */}
          {characterImageUrl && (
            <div className="image-preview-container">
              <h5>当前角色图片：</h5>
              <img 
                src={characterImageUrl} 
                alt="自定义角色" 
                className="preview-image"
              />
            </div>
          )}
        </div>
        
        {/* 头发颜色 */}
        <div className="customization-option">
          <label>头发颜色：</label>
          <div className="color-options">
            {characterOptions.hairColor.map((color, index) => (
              <div 
                key={`hair-${index}`}
                className={`color-option ${characterCustomization.hairColor === color ? 'active' : ''}`}
                onClick={() => onCharacterCustomizationChange({
                  ...characterCustomization,
                  hairColor: color
                })}
                style={{ backgroundColor: color }}
                title={color}
              ></div>
            ))}
          </div>
        </div>
        
        {/* 眼睛颜色 */}
        <div className="customization-option">
          <label>眼睛颜色：</label>
          <div className="color-options">
            {characterOptions.eyeColor.map((color, index) => (
              <div 
                key={`eye-${index}`}
                className={`color-option ${characterCustomization.eyeColor === color ? 'active' : ''}`}
                onClick={() => onCharacterCustomizationChange({
                  ...characterCustomization,
                  eyeColor: color
                })}
                style={{ backgroundColor: color }}
                title={color}
              ></div>
            ))}
          </div>
        </div>
        
        {/* 服装颜色 */}
        <div className="customization-option">
          <label>服装颜色：</label>
          <div className="color-options">
            {characterOptions.outfitColor.map((color, index) => (
              <div 
                key={`outfit-${index}`}
                className={`color-option ${characterCustomization.outfitColor === color ? 'active' : ''}`}
                onClick={() => onCharacterCustomizationChange({
                  ...characterCustomization,
                  outfitColor: color
                })}
                style={{ backgroundColor: color }}
                title={color}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .customization-panel {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 20px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          z-index: 100;
          max-width: 300px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        }
        
        h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          text-align: center;
          color: #4ecdc4;
        }
        
        h4 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #4ecdc4;
        }
        
        .customization-section {
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .customization-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .texture-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        
        .texture-option {
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .texture-option:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
        }
        
        .texture-option.active {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
        }
        
        .texture-preview {
          width: 40px;
          height: 30px;
          margin: 0 auto 8px;
          border-radius: 50% 50% 0 0;
          position: relative;
        }
        
        .texture-option span {
          font-size: 12px;
          display: block;
        }
        
        .customization-option {
          margin-bottom: 15px;
        }
        
        .customization-option label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
        }
        
        .color-options {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .color-option {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .color-option:hover {
          transform: scale(1.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .color-option.active {
          transform: scale(1.2);
          border-color: #ffffff;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        /* 上传按钮样式 */
        .upload-section {
          margin-bottom: 15px;
        }
        
        .upload-button {
          padding: 10px 15px;
          background: rgba(76, 205, 196, 0.8);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .upload-button:hover {
          background: rgba(76, 205, 196, 1);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(76, 205, 196, 0.4);
        }
        
        /* 图片预览样式 */
        .image-preview-container {
          margin-top: 15px;
          text-align: center;
        }
        
        .image-preview-container h5 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #ffffff;
        }
        
        .preview-image {
          max-width: 100%;
          max-height: 150px;
          border-radius: 5px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          object-fit: contain;
        }
      `}</style>
    </div>
  );
};

export default CustomizationPanel;