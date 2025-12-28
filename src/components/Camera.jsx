import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const Camera = ({ isActive, onFaceDetected, onVideoReady }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showAutoplayHint, setShowAutoplayHint] = useState(true);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      // 检查浏览器是否支持getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }
      
      // 重置状态
      setIsVideoPlaying(false);
      setShowAutoplayHint(true);
      setVideoSize({ width: 0, height: 0 });
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          // 添加 iOS 兼容配置
          frameRate: { ideal: 30, max: 60 }
        },
        audio: false
      });
      
      const video = videoRef.current;
      video.srcObject = stream;
      
      // 等待视频准备好
      video.onloadedmetadata = () => {
        console.log('视频元数据加载完成，准备播放');
        console.log('视频宽度:', video.videoWidth);
        console.log('视频高度:', video.videoHeight);
        
        setVideoSize({ 
          width: video.videoWidth, 
          height: video.videoHeight 
        });
        
        // 尝试播放视频
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('视频播放成功');
            setIsVideoPlaying(true);
            setShowAutoplayHint(false);
            
            if (onVideoReady) {
              onVideoReady(video);
            }
            detectFaces();
          }).catch(error => {
            console.error('视频播放失败:', error.message);
            console.error('错误名称:', error.name);
            console.error('完整错误:', error);
            
            // 处理自动播放策略限制
            if (error.name === 'NotAllowedError') {
              console.error('自动播放被浏览器策略阻止，请尝试添加用户交互后再播放');
              setShowAutoplayHint(true);
            }
          });
        }
      };
      
      // 监听视频播放事件
      video.onplay = () => {
        console.log('视频开始播放');
        setIsVideoPlaying(true);
        setShowAutoplayHint(false);
      };
      
      // 监听视频暂停事件
      video.onpause = () => {
        console.log('视频已暂停');
        setIsVideoPlaying(false);
      };
      
      // 监听视频结束事件
      video.onended = () => {
        console.log('视频已结束');
        setIsVideoPlaying(false);
      };
      
      // 监听视频错误
      video.onerror = (error) => {
        console.error('视频元素错误:', error);
        console.error('错误代码:', error.target.error.code);
        setIsVideoPlaying(false);
      };
    } catch (error) {
      // 只保留必要的错误信息
      let errorMessage = '摄像头访问失败: ';
      
      switch (error.name) {
        case 'NotAllowedError':
          errorMessage += '用户拒绝了摄像头访问权限';
          break;
        case 'NotFoundError':
          errorMessage += '未检测到摄像头设备';
          break;
        case 'NotReadableError':
          errorMessage += '摄像头已被其他应用占用';
          break;
        case 'OverconstrainedError':
          errorMessage += '摄像头不支持当前分辨率设置';
          break;
        default:
          errorMessage += error.message;
      }
      
      console.error(errorMessage);
      alert(errorMessage);
      setIsVideoPlaying(false);
    }
  };

  const stopCamera = () => {
    console.log('停止相机');
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => {
        console.log('停止轨道:', track.kind);
        track.stop();
      });
      videoRef.current.srcObject = null;
      console.log('视频流已停止');
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      console.log('动画帧已取消');
    }
    
    // 重置状态
    setIsVideoPlaying(false);
    setShowAutoplayHint(true);
    setVideoSize({ width: 0, height: 0 });
    
    // 重置视频元素
    if (videoRef.current) {
      videoRef.current.pause();
      console.log('视频已暂停');
    }
  };

  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const displaySize = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight
    };

    faceapi.matchDimensions(canvasRef.current, displaySize);

    const detect = async () => {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (resizedDetections.length > 0) {
        // 找到画面中间的面部
        const centerX = displaySize.width / 2;
        
        // 计算每个面部到画面中心的距离
        const facesWithDistance = resizedDetections.map((detection, index) => {
          const box = detection.detection.box;
          const faceCenterX = box.x + box.width / 2;
          const distance = Math.abs(faceCenterX - centerX);
          return { ...detection, distance, index };
        });
        
        // 按距离排序，选择最近的（中间的）面部
        facesWithDistance.sort((a, b) => a.distance - b.distance);
        const middleFace = facesWithDistance[0];
        
        const landmarks = middleFace.landmarks;
        onFaceDetected(landmarks);
      } else {
        onFaceDetected(null);
      }

      animationRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  return (
    <div className="camera-container">
      {/* 相机状态指示器 */}
      <div className="camera-status">
        <span>相机状态: {isVideoPlaying ? '运行中' : '已停止'}</span>
        {videoSize.width > 0 && (
          <span>视频尺寸: {videoSize.width}x{videoSize.height}</span>
        )}
      </div>
      
      {/* 视频元素 - 确保可见 */}
      <video
        ref={videoRef}
        className="camera-video"
        autoPlay
        playsInline
        muted
        id="camera-video"
        style={{ 
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1,
          objectFit: 'cover'
        }}
        onClick={() => {
          // 处理用户交互，解决自动播放策略限制
          const video = videoRef.current;
          if (video && video.paused) {
            video.play().then(() => {
              setIsVideoPlaying(true);
              setShowAutoplayHint(false);
            }).catch(error => {
              console.error('点击播放失败:', error.message);
            });
          }
        }}
      />
      
      {/* 自动播放提示 - 仅在需要时显示 */}
      {showAutoplayHint && (
        <div className="autoplay-hint">
          <p>📷 点击画面启动相机</p>
          <p>（浏览器自动播放策略要求）</p>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className="camera-canvas"
      />
      
      <style jsx>{`
        .camera-container {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .camera-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
          z-index: 1;
          display: block;
          background-color: #000;
          position: relative;
        }
        
        .camera-status {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px 15px;
          border-radius: 5px;
          font-size: 12px;
          z-index: 10;
          pointer-events: none;
        }
        
        .camera-status span {
          display: block;
          margin-bottom: 5px;
        }
        
        .camera-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: scaleX(-1);
          pointer-events: none;
          z-index: 2;
        }
        
        .autoplay-hint {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 20px 30px;
          border-radius: 10px;
          text-align: center;
          font-size: 18px;
          z-index: 5;
          cursor: pointer;
          pointer-events: auto;
          transition: opacity 0.3s ease;
        }
        
        .autoplay-hint p {
          margin: 5px 0;
        }
        
        .autoplay-hint p:last-child {
          font-size: 14px;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default Camera;