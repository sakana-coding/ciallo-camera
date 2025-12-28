import React from 'react';

const InteractiveProps = ({ selectedProp, onPropChange, facialLandmarks }) => {
  // 可用道具列表
  const propsList = [
    { id: 'none', name: '无道具', icon: '❌' },
    { id: 'sunglasses', name: '太阳镜', icon: '🕶️' },
    { id: 'hat', name: '帽子', icon: '🎩' },
    { id: 'flower', name: '花朵', icon: '🌸' },
    { id: 'star', name: '星星', icon: '⭐' },
    { id: 'heart', name: '爱心', icon: '❤️' }
  ];

  // 绘制道具
  const renderProp = () => {
    if (selectedProp === 'none' || !facialLandmarks) return null;

    // 获取面部关键点
    const points = facialLandmarks.positions;
    
    // 视频原始尺寸
    const videoWidth = 1280;
    const videoHeight = 720;
    
    // 计算缩放比例
    const scale = Math.max(window.innerWidth / videoWidth, window.innerHeight / videoHeight);
    const offsetX = (window.innerWidth - videoWidth * scale) / 2;
    const offsetY = (window.innerHeight - videoHeight * scale) / 2;
    
    // 坐标转换函数
    const toWindowCoords = (point) => ({
      x: point.x * scale + offsetX,
      y: point.y * scale + offsetY
    });
    
    // 转换关键点坐标
    const convertedPoints = points.map(toWindowCoords);
    
    // 根据道具类型绘制不同的道具
    switch (selectedProp) {
      case 'sunglasses':
        return renderSunglasses(convertedPoints);
      case 'hat':
        return renderHat(convertedPoints);
      case 'flower':
        return renderFlower(convertedPoints);
      case 'star':
        return renderStar(convertedPoints);
      case 'heart':
        return renderHeart(convertedPoints);
      default:
        return null;
    }
  };

  // 绘制太阳镜
  const renderSunglasses = (points) => {
    const leftEye = points[36];
    const rightEye = points[45];
    const width = Math.abs(rightEye.x - leftEye.x) + 60;
    const height = width / 3;
    const centerX = (leftEye.x + rightEye.x) / 2;
    const centerY = (leftEye.y + rightEye.y) / 2;

    return (
      <div 
        className="interactive-prop sunglasses" 
        style={{
          left: `${centerX - width / 2}px`,
          top: `${centerY - height / 2}px`,
          width: `${width}px`,
          height: `${height}px`
        }}
      >
        🕶️
      </div>
    );
  };

  // 绘制帽子
  const renderHat = (points) => {
    const leftEar = points[0];
    const rightEar = points[16];
    const width = Math.abs(rightEar.x - leftEar.x) + 80;
    const height = width / 2;
    const centerX = (leftEar.x + rightEar.x) / 2;
    const topY = leftEar.y - height;

    return (
      <div 
        className="interactive-prop hat" 
        style={{
          left: `${centerX - width / 2}px`,
          top: `${topY}px`,
          width: `${width}px`,
          height: `${height}px`
        }}
      >
        🎩
      </div>
    );
  };

  // 绘制花朵
  const renderFlower = (points) => {
    const nose = points[30];
    const size = 80;

    return (
      <div 
        className="interactive-prop flower" 
        style={{
          left: `${nose.x - size / 2}px`,
          top: `${nose.y - size / 2}px`,
          width: `${size}px`,
          height: `${size}px`
        }}
      >
        🌸
      </div>
    );
  };

  // 绘制星星
  const renderStar = (points) => {
    const leftCheek = points[2];
    const size = 60;

    return (
      <div 
        className="interactive-prop star" 
        style={{
          left: `${leftCheek.x - size / 2}px`,
          top: `${leftCheek.y - size / 2}px`,
          width: `${size}px`,
          height: `${size}px`
        }}
      >
        ⭐
      </div>
    );
  };

  // 绘制爱心
  const renderHeart = (points) => {
    const rightCheek = points[14];
    const size = 60;

    return (
      <div 
        className="interactive-prop heart" 
        style={{
          left: `${rightCheek.x - size / 2}px`,
          top: `${rightCheek.y - size / 2}px`,
          width: `${size}px`,
          height: `${size}px`
        }}
      >
        ❤️
      </div>
    );
  };

  return (
    <div className="interactive-props">
      {/* 道具选择面板 */}
      <div className="props-selector">
        <label>互动道具：</label>
        <select 
          value={selectedProp} 
          onChange={(e) => onPropChange(e.target.value)}
        >
          {propsList.map(prop => (
            <option key={prop.id} value={prop.id}>
              {prop.icon} {prop.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* 渲染选中的道具 */}
      {renderProp()}
      
      <style jsx>{`
        .interactive-props {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 100;
          pointer-events: auto;
        }
        
        .props-selector {
          background: rgba(0, 0, 0, 0.7);
          padding: 15px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        label {
          color: white;
          font-size: 14px;
          font-weight: 600;
        }
        
        select {
          padding: 8px 12px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 14px;
          cursor: pointer;
          outline: none;
        }
        
        select option {
          background: #333;
          color: white;
        }
        
        .interactive-prop {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 48px;
          pointer-events: none;
          z-index: 50;
          transform: scaleX(-1); /* 镜像翻转，与摄像头一致 */
        }
        
        /* 道具动画 */
        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
            transform: scaleX(-1) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scaleX(-1) scale(1.2);
          }
        }
        
        @keyframes beat {
          0%, 100% {
            transform: scaleX(-1) scale(1);
          }
          14% {
            transform: scaleX(-1) scale(1.1);
          }
          28% {
            transform: scaleX(-1) scale(1);
          }
          42% {
            transform: scaleX(-1) scale(1.1);
          }
          70% {
            transform: scaleX(-1) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveProps;