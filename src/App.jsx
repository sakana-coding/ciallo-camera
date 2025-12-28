import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import Camera from './components/Camera';
import AREffects from './components/AREffects';
import VirtualCharacter from './components/VirtualCharacter';
import Controls from './components/Controls';
import BeautyFilter from './components/BeautyFilter';
import CameraControls from './components/CameraControls';
import InteractiveProps from './components/InteractiveProps';
import CustomizationPanel from './components/CustomizationPanel';

function App() {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [facialLandmarks, setFacialLandmarks] = useState(null);
  const [showVirtualChar, setShowVirtualChar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [videoElement, setVideoElement] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  
  // 用于截图的canvas
  const captureCanvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  
  // AR特效状态管理
  const [effects, setEffects] = useState({
    showCatEars: true,
    showCatTail: true,
    showFacePattern: true,
    showPupils: true
  });
  
  // 滤镜状态管理
  const [filter, setFilter] = useState({
    activeFilter: 'none', // none, acg, anime, soft, warm, cool
    intensity: 50 // 0-100
  });
  
  // 互动道具状态管理
  const [selectedProp, setSelectedProp] = useState('none'); // none, sunglasses, hat, flower, star, heart
  
  // 自定义选项状态管理
  const [earTexture, setEarTexture] = useState({
    id: 'default',
    name: '默认猫耳',
    color: '#ffccaa',
    innerColor: '#ff9966'
  });
  
  const [characterCustomization, setCharacterCustomization] = useState({
    hairColor: '#333333',
    eyeColor: '#4a90e2',
    outfitColor: '#ff6b9d'
  });
  
  // 自定义图片URL状态管理
  const [earImageUrl, setEarImageUrl] = useState(null);
  const [characterImageUrl, setCharacterImageUrl] = useState(null);
  
  // 处理猫耳图片上传
  const handleEarImageUpload = (imageUrl) => {
    setEarImageUrl(imageUrl);
  };
  
  // 处理角色图片上传
  const handleCharacterImageUpload = (imageUrl) => {
    setCharacterImageUrl(imageUrl);
  };

  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      try {
        // 在Capacitor应用中使用相对路径
        const MODEL_URL = './models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error('模型加载失败:', error);
        // 记录详细错误信息
        console.error('错误名称:', error.name);
        console.error('错误堆栈:', error.stack);
        setIsLoading(false);
      }
    };
    loadModels();
  }, []);

  const handleFaceDetected = (landmarks) => {
    setFacialLandmarks(landmarks);
  };

  const handleVideoReady = (video) => {
    setVideoElement(video);
  };

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  const toggleEffect = (effectName) => {
    setEffects(prev => ({
      ...prev,
      [effectName]: !prev[effectName]
    }));
  };

  const updateFilter = (newFilter) => {
    setFilter(prev => ({
      ...prev,
      ...newFilter
    }));
  };

  const toggleVirtualChar = () => {
    setShowVirtualChar(!showVirtualChar);
  };

  // 拍照功能
  const takePhoto = () => {
    if (!videoElement) return;

    // 创建canvas用于绘制当前画面
    const canvas = captureCanvasRef.current || document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    captureCanvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    
    // 绘制视频帧
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // 转换为图片并下载
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `ciallo-camera-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  // 开始录像功能
  const startRecording = () => {
    if (!videoElement || isRecording) return;

    setIsRecording(true);
    recordedChunksRef.current = [];

    const mediaRecorder = new MediaRecorder(videoElement.srcObject, {
      mimeType: 'video/webm;codecs=vp9'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, {
        type: 'video/webm'
      });
      
      // 下载录像
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `ciallo-camera-${Date.now()}.webm`;
      link.href = url;
      link.click();
      
      URL.revokeObjectURL(url);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
  };

  // 停止录像功能
  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // 互动道具处理
  const handlePropChange = (propId) => {
    setSelectedProp(propId);
  };

  return (
    <div className="app">
      {isLoading ? (
        <div className="loading">
          <h1>加载模型中...</h1>
        </div>
      ) : (
        <>
          {/* 相机组件 - 始终渲染，通过isActive控制 */}
          <Camera
            isActive={isCameraActive}
            onFaceDetected={handleFaceDetected}
            onVideoReady={handleVideoReady}
          />
          
          {videoElement && filter.activeFilter !== 'none' && (
            <BeautyFilter 
              videoElement={videoElement} 
              activeFilter={filter.activeFilter} 
              intensity={filter.intensity} 
            />
          )}
          
          {facialLandmarks && (
            <AREffects 
              landmarks={facialLandmarks} 
              effects={effects} 
              earTexture={earTexture} 
              earImageUrl={earImageUrl}
            />
          )}
          
          {showVirtualChar && (
            <VirtualCharacter 
              facialLandmarks={facialLandmarks} 
              customization={characterCustomization} 
              characterImageUrl={characterImageUrl}
            />
          )}
          
          {/* 自定义面板 */}
          <CustomizationPanel 
            onEarTextureChange={setEarTexture}
            onCharacterCustomizationChange={setCharacterCustomization}
            onEarImageUpload={handleEarImageUpload}
            onCharacterImageUpload={handleCharacterImageUpload}
            earTexture={earTexture}
            characterCustomization={characterCustomization}
            earImageUrl={earImageUrl}
            characterImageUrl={characterImageUrl}
          />
          
          {/* 互动道具 */}
          {isCameraActive && (
            <InteractiveProps
              selectedProp={selectedProp}
              onPropChange={handlePropChange}
              facialLandmarks={facialLandmarks}
            />
          )}
          
          {/* 相机控制按钮 */}
          {isCameraActive && (
            <CameraControls
              onTakePhoto={takePhoto}
              onStartRecord={startRecording}
              onStopRecord={stopRecording}
              isRecording={isRecording}
            />
          )}
          
          <Controls
            isCameraActive={isCameraActive}
            toggleCamera={toggleCamera}
            effects={effects}
            toggleEffect={toggleEffect}
            filter={filter}
            updateFilter={updateFilter}
            showVirtualChar={showVirtualChar}
            toggleVirtualChar={toggleVirtualChar}
          />
        </>
      )}
      
      <style jsx>{`
        .app {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .loading {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 24px;
        }
      `}</style>
    </div>
  );
}

export default App;