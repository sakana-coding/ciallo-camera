import React, { useEffect, useRef } from 'react';

const BeautyFilter = ({ videoElement, activeFilter, intensity }) => {
  const canvasRef = useRef(null);
  const tempCanvasRef = useRef(null);

  useEffect(() => {
    if (!videoElement || !canvasRef.current || !tempCanvasRef.current) return;

    const canvas = canvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const tempCtx = tempCanvas.getContext('2d');

    // 设置canvas大小
    const setupCanvas = () => {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      tempCanvas.width = videoElement.videoWidth;
      tempCanvas.height = videoElement.videoHeight;
    };

    setupCanvas();

    // 动画循环
    const animate = () => {
      if (videoElement.paused || videoElement.ended) {
        requestAnimationFrame(animate);
        return;
      }

      // 绘制原始视频帧到临时canvas
      tempCtx.drawImage(videoElement, 0, 0, tempCanvas.width, tempCanvas.height);

      // 获取视频帧数据
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      let filteredData = imageData;

      // 应用滤镜
      switch (activeFilter) {
        case 'acg':
          filteredData = applyACGFilter(imageData, intensity);
          break;
        case 'anime':
          filteredData = applyAnimeFilter(imageData, intensity);
          break;
        case 'soft':
          filteredData = applySoftFilter(imageData, intensity);
          break;
        case 'warm':
          filteredData = applyWarmFilter(imageData, intensity);
          break;
        case 'cool':
          filteredData = applyCoolFilter(imageData, intensity);
          break;
        default:
          filteredData = imageData;
      }

      // 绘制处理后的图像到显示canvas
      ctx.putImageData(filteredData, 0, 0);
      requestAnimationFrame(animate);
    };

    animate();

    // 处理窗口大小变化
    const handleResize = () => {
      setupCanvas();
    };

    videoElement.addEventListener('resize', handleResize);

    return () => {
      videoElement.removeEventListener('resize', handleResize);
    };
  }, [videoElement, activeFilter, intensity]);

  // ACG风格滤镜
  const applyACGFilter = (imageData, intensity) => {
    const data = imageData.data;
    const factor = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // 增强色彩饱和度
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
      r = Math.min(255, r + (r - gray) * factor * 1.5);
      g = Math.min(255, g + (g - gray) * factor * 1.2);
      b = Math.min(255, b + (b - gray) * factor * 1.3);

      // 调整色调为ACG风格
      r = Math.min(255, r * (1 + factor * 0.2));
      g = Math.min(255, g * (1 + factor * 0.1));
      b = Math.min(255, b * (1 + factor * 0.3));

      // 美白效果
      r = Math.min(255, r + factor * 20);
      g = Math.min(255, g + factor * 15);
      b = Math.min(255, b + factor * 10);

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    return imageData;
  };

  // 动漫手绘风格滤镜
  const applyAnimeFilter = (imageData, intensity) => {
    const data = imageData.data;
    const factor = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // 简化色彩，创建手绘效果
      r = Math.round(r / 50) * 50 + factor * 25;
      g = Math.round(g / 50) * 50 + factor * 20;
      b = Math.round(b / 50) * 50 + factor * 15;

      // 增加对比度
      const contrast = 1 + factor * 0.5;
      r = Math.min(255, Math.max(0, (r - 128) * contrast + 128));
      g = Math.min(255, Math.max(0, (g - 128) * contrast + 128));
      b = Math.min(255, Math.max(0, (b - 128) * contrast + 128));

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    return imageData;
  };

  // 柔和美颜滤镜
  const applySoftFilter = (imageData, intensity) => {
    const data = imageData.data;
    const factor = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // 柔和磨皮效果
      r = Math.min(255, r + factor * 30);
      g = Math.min(255, g + factor * 25);
      b = Math.min(255, b + factor * 20);

      // 降低锐度
      const blurFactor = 0.3 * factor;
      r = r * (1 - blurFactor) + 128 * blurFactor;
      g = g * (1 - blurFactor) + 128 * blurFactor;
      b = b * (1 - blurFactor) + 128 * blurFactor;

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    return imageData;
  };

  // 暖色调滤镜
  const applyWarmFilter = (imageData, intensity) => {
    const data = imageData.data;
    const factor = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      data[i] += factor * 30;     // 增加红色
      data[i + 1] += factor * 15;   // 增加绿色
      data[i + 2] -= factor * 10;   // 减少蓝色
    }

    return imageData;
  };

  // 冷色调滤镜
  const applyCoolFilter = (imageData, intensity) => {
    const data = imageData.data;
    const factor = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      data[i] -= factor * 10;     // 减少红色
      data[i + 1] += factor * 10;   // 增加绿色
      data[i + 2] += factor * 30;   // 增加蓝色
    }

    return imageData;
  };

  return (
    <div className="beauty-filter-container">
      <canvas ref={canvasRef} className="beauty-filter-canvas" />
      <canvas ref={tempCanvasRef} style={{ display: 'none' }} />
      
      <style jsx>{`
        .beauty-filter-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 3; /* 确保在相机之上，但在AR特效之下 */
        }
        
        .beauty-filter-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default BeautyFilter;