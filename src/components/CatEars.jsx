import React, { useEffect, useRef } from 'react';

const CatEars = ({ landmarks }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!landmarks || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置canvas大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 获取面部关键点
    const points = landmarks.positions;
    
    // 视频原始尺寸（与face-api检测的尺寸匹配）
    const videoWidth = 1280;
    const videoHeight = 720;
    
    // 计算缩放比例和偏移量（处理object-fit: cover）
    const scale = Math.max(window.innerWidth / videoWidth, window.innerHeight / videoHeight);
    const offsetX = (window.innerWidth - videoWidth * scale) / 2;
    const offsetY = (window.innerHeight - videoHeight * scale) / 2;
    
    // 坐标转换函数：将视频坐标转换为窗口坐标
    const toWindowCoords = (point) => ({
      x: point.x * scale + offsetX,
      y: point.y * scale + offsetY
    });
    
    // 转换关键点坐标
    const leftEar = toWindowCoords(points[0]);    // 左额头点
    const rightEar = toWindowCoords(points[16]);   // 右额头点
    const nose = toWindowCoords(points[30]);       // 鼻尖点
    
    // 计算猫耳位置和大小
    const earHeight = Math.sqrt(
      Math.pow(nose.x - leftEar.x, 2) + Math.pow(nose.y - leftEar.y, 2)
    ) * 1.5;
    
    const leftEarTop = {
      x: leftEar.x,
      y: leftEar.y - earHeight
    };
    
    const rightEarTop = {
      x: rightEar.x,
      y: rightEar.y - earHeight
    };
    
    // 绘制左耳
    ctx.beginPath();
    ctx.moveTo(leftEar.x, leftEar.y);
    ctx.quadraticCurveTo(leftEarTop.x - 20, leftEarTop.y, leftEarTop.x, leftEarTop.y);
    ctx.quadraticCurveTo(leftEarTop.x + 20, leftEarTop.y, leftEar.x + 30, leftEar.y);
    ctx.closePath();
    
    // 填充耳朵内部
    ctx.fillStyle = '#ffccaa';
    ctx.fill();
    
    // 绘制耳朵边缘
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 绘制内耳绒毛
    ctx.beginPath();
    ctx.moveTo(leftEar.x + 10, leftEar.y - 10);
    ctx.quadraticCurveTo(leftEarTop.x - 10, leftEarTop.y + 20, leftEarTop.x, leftEarTop.y - 10);
    ctx.quadraticCurveTo(leftEarTop.x + 10, leftEarTop.y + 20, leftEar.x + 20, leftEar.y - 10);
    ctx.closePath();
    ctx.fillStyle = '#ff9966';
    ctx.fill();
    
    // 绘制右耳
    ctx.beginPath();
    ctx.moveTo(rightEar.x, rightEar.y);
    ctx.quadraticCurveTo(rightEarTop.x + 20, rightEarTop.y, rightEarTop.x, rightEarTop.y);
    ctx.quadraticCurveTo(rightEarTop.x - 20, rightEarTop.y, rightEar.x - 30, rightEar.y);
    ctx.closePath();
    
    // 填充耳朵内部
    ctx.fillStyle = '#ffccaa';
    ctx.fill();
    
    // 绘制耳朵边缘
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 绘制内耳绒毛
    ctx.beginPath();
    ctx.moveTo(rightEar.x - 10, rightEar.y - 10);
    ctx.quadraticCurveTo(rightEarTop.x + 10, rightEarTop.y + 20, rightEarTop.x, rightEarTop.y - 10);
    ctx.quadraticCurveTo(rightEarTop.x - 10, rightEarTop.y + 20, rightEar.x - 20, rightEar.y - 10);
    ctx.closePath();
    ctx.fillStyle = '#ff9966';
    ctx.fill();
    
  }, [landmarks]);

  return (
    <div className="cat-ears-container">
      <canvas
        ref={canvasRef}
        className="cat-ears-canvas"
      />
      
      <style jsx>{`
        .cat-ears-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 10;
        }
        
        .cat-ears-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: scaleX(-1); /* 镜像翻转，与摄像头一致 */
        }
      `}</style>
    </div>
  );
};

export default CatEars;