import React from 'react';

const Controls = ({ 
  isCameraActive, 
  toggleCamera, 
  effects, 
  toggleEffect, 
  filter, 
  updateFilter,
  showVirtualChar, 
  toggleVirtualChar 
}) => {
  return (
    <div className="controls-container">
      {/* 相机和虚拟角色控制 */}
      <div className="controls-row main-controls">
        <button 
          className={`control-button ${isCameraActive ? 'active' : ''}`}
          onClick={toggleCamera}
        >
          {isCameraActive ? '关闭相机' : '开启相机'}
        </button>
        
        <button 
          className={`control-button ${showVirtualChar ? 'active' : ''}`}
          onClick={toggleVirtualChar}
        >
          {showVirtualChar ? '隐藏角色' : '显示角色'}
        </button>
      </div>
      
      {/* 滤镜控制 */}
      {isCameraActive && (
        <div className="controls-row filter-controls">
          <div className="filter-selector">
            <label>滤镜：</label>
            <select 
              value={filter.activeFilter} 
              onChange={(e) => updateFilter({ activeFilter: e.target.value })}
            >
              <option value="none">无滤镜</option>
              <option value="acg">ACG风格</option>
              <option value="anime">动漫手绘</option>
              <option value="soft">柔和美颜</option>
              <option value="warm">暖色调</option>
              <option value="cool">冷色调</option>
            </select>
          </div>
          
          {filter.activeFilter !== 'none' && (
            <div className="intensity-control">
              <label>强度：{filter.intensity}%</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={filter.intensity} 
                onChange={(e) => updateFilter({ intensity: parseInt(e.target.value) })}
              />
            </div>
          )}
        </div>
      )}
      
      {/* AR特效控制 */}
      {isCameraActive && (
        <div className="controls-row effects-controls">
          <button 
            className={`control-button ${effects.showCatEars ? 'active' : ''}`}
            onClick={() => toggleEffect('showCatEars')}
          >
            {effects.showCatEars ? '隐藏猫耳' : '显示猫耳'}
          </button>
          
          <button 
            className={`control-button ${effects.showCatTail ? 'active' : ''}`}
            onClick={() => toggleEffect('showCatTail')}
          >
            {effects.showCatTail ? '隐藏猫尾' : '显示猫尾'}
          </button>
          
          <button 
            className={`control-button ${effects.showFacePattern ? 'active' : ''}`}
            onClick={() => toggleEffect('showFacePattern')}
          >
            {effects.showFacePattern ? '隐藏脸纹' : '显示脸纹'}
          </button>
          
          <button 
            className={`control-button ${effects.showPupils ? 'active' : ''}`}
            onClick={() => toggleEffect('showPupils')}
          >
            {effects.showPupils ? '隐藏瞳孔' : '显示瞳孔'}
          </button>
        </div>
      )}
      
      <style jsx>{`
        .controls-container {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          z-index: 100;
        }
        
        .controls-row {
          display: flex;
          gap: 15px;
          background: rgba(0, 0, 0, 0.7);
          padding: 15px 25px;
          border-radius: 50px;
          backdrop-filter: blur(10px);
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }
        
        .main-controls {
          background: rgba(76, 205, 196, 0.8);
        }
        
        .filter-controls {
          background: rgba(155, 89, 182, 0.8);
        }
        
        .effects-controls {
          background: rgba(255, 107, 107, 0.8);
        }
        
        .control-button {
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
        }
        
        .control-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
        }
        
        .control-button.active {
          background: rgba(255, 255, 255, 0.5);
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.4);
        }
        
        .control-button:active {
          transform: translateY(0);
        }
        
        .filter-selector {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .intensity-control {
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
        
        input[type="range"] {
          width: 150px;
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default Controls;