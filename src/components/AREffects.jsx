import React, { useEffect, useRef, useState } from 'react';

const AREffects = ({ landmarks, effects, earTexture, earImageUrl }) => {
  const canvasRef = useRef(null);
  const [earImage, setEarImage] = useState(null);

  // 加载自定义猫耳图片
  useEffect(() => {
    if (earImageUrl) {
      const img = new Image();
      img.onload = () => {
        setEarImage(img);
      };
      img.onerror = () => {
        console.error('无法加载自定义猫耳图片');
        setEarImage(null);
      };
      img.src = earImageUrl;
    } else {
      setEarImage(null);
    }
  }, [earImageUrl]);

  useEffect(() => {
    if (!landmarks || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置canvas大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 视频原始尺寸
    const videoWidth = 1280;
    const videoHeight = 720;
    
    // 计算缩放比例和偏移量
    const scale = Math.max(window.innerWidth / videoWidth, window.innerHeight / videoHeight);
    const offsetX = (window.innerWidth - videoWidth * scale) / 2;
    const offsetY = (window.innerHeight - videoHeight * scale) / 2;
    
    // 坐标转换函数
    const toWindowCoords = (point) => ({
      x: point.x * scale + offsetX,
      y: point.y * scale + offsetY
    });
    
    // 获取面部关键点
    const points = landmarks.positions;
    
    // 转换关键点坐标
    const convertedPoints = points.map(toWindowCoords);
    
    // 绘制各种特效
    if (effects.showCatEars) {
      if (earImage) {
        // 使用自定义图片作为猫耳
        drawCustomEarImage(ctx, convertedPoints, earImage);
      } else {
        // 使用绘制的猫耳
        drawCatEars(ctx, convertedPoints);
      }
    }
    
    if (effects.showCatTail) {
      drawCatTail(ctx, convertedPoints);
    }
    
    if (effects.showFacePattern) {
      drawFacePattern(ctx, convertedPoints);
    }
    
    if (effects.showPupils) {
      drawPupils(ctx, convertedPoints);
    }
    
  }, [landmarks, effects, earTexture, earImage]);

  // 绘制自定义猫耳图片
  const drawCustomEarImage = (ctx, points, earImage) => {
    const leftEar = points[0];    // 左额头点
    const rightEar = points[16];   // 右额头点
    const nose = points[30];       // 鼻尖点
    
    // 计算猫耳大小
    const earHeight = Math.sqrt(
      Math.pow(nose.x - leftEar.x, 2) + Math.pow(nose.y - leftEar.y, 2)
    ) * 1.5;
    
    // 计算猫耳位置
    const leftEarTop = {
      x: leftEar.x,
      y: leftEar.y - earHeight
    };
    
    const rightEarTop = {
      x: rightEar.x,
      y: rightEar.y - earHeight
    };
    
    // 计算图片尺寸
    const earWidth = earHeight * 0.8;
    const earHeightScaled = earHeight * 1.5;
    
    // 绘制左耳图片
    ctx.save();
    ctx.translate(leftEarTop.x, leftEarTop.y);
    ctx.rotate(Math.PI / 6); // 旋转角度，与绘制的猫耳保持一致
    ctx.drawImage(
      earImage,
      -earWidth / 2,
      0,
      earWidth,
      earHeightScaled
    );
    ctx.restore();
    
    // 绘制右耳图片
    ctx.save();
    ctx.translate(rightEarTop.x, rightEarTop.y);
    ctx.rotate(-Math.PI / 6); // 旋转角度，与绘制的猫耳保持一致
    ctx.drawImage(
      earImage,
      -earWidth / 2,
      0,
      earWidth,
      earHeightScaled
    );
    ctx.restore();
  };
  
  // 绘制猫耳
  const drawCatEars = (ctx, points) => {
    const leftEar = points[0];    // 左额头点
    const rightEar = points[16];   // 右额头点
    const nose = points[30];       // 鼻尖点
    
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
    ctx.fillStyle = earTexture.color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 绘制内耳绒毛
    ctx.beginPath();
    ctx.moveTo(leftEar.x + 10, leftEar.y - 10);
    ctx.quadraticCurveTo(leftEarTop.x - 10, leftEarTop.y + 20, leftEarTop.x, leftEarTop.y - 10);
    ctx.quadraticCurveTo(leftEarTop.x + 10, leftEarTop.y + 20, leftEar.x + 20, leftEar.y - 10);
    ctx.closePath();
    ctx.fillStyle = earTexture.innerColor;
    ctx.fill();
    
    // 绘制右耳
    ctx.beginPath();
    ctx.moveTo(rightEar.x, rightEar.y);
    ctx.quadraticCurveTo(rightEarTop.x + 20, rightEarTop.y, rightEarTop.x, rightEarTop.y);
    ctx.quadraticCurveTo(rightEarTop.x - 20, rightEarTop.y, rightEar.x - 30, rightEar.y);
    ctx.closePath();
    ctx.fillStyle = earTexture.color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 绘制内耳绒毛
    ctx.beginPath();
    ctx.moveTo(rightEar.x - 10, rightEar.y - 10);
    ctx.quadraticCurveTo(rightEarTop.x + 10, rightEarTop.y + 20, rightEarTop.x, rightEarTop.y - 10);
    ctx.quadraticCurveTo(rightEarTop.x - 10, rightEarTop.y + 20, rightEar.x - 20, rightEar.y - 10);
    ctx.closePath();
    ctx.fillStyle = earTexture.innerColor;
    ctx.fill();
  };

  // 绘制猫尾
  const drawCatTail = (ctx, points) => {
    // 简化实现：基于颈部点绘制尾巴
    const neck = points[17]; // 左脸颊点
    const tailLength = 200;
    
    // 尾巴曲线
    ctx.beginPath();
    ctx.moveTo(neck.x - 50, neck.y + 100);
    
    // 使用贝塞尔曲线绘制弯曲的尾巴
    ctx.bezierCurveTo(
      neck.x - 150, neck.y + 150,
      neck.x - 200, neck.y + 250,
      neck.x - 100, neck.y + 300
    );
    
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffccaa';
    ctx.stroke();
    
    // 尾巴尖端
    ctx.beginPath();
    ctx.arc(neck.x - 100, neck.y + 300, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#ff9966';
    ctx.fill();
  };

  // 绘制脸纹
  const drawFacePattern = (ctx, points) => {
    const leftCheek = points[2];  // 左脸颊
    const rightCheek = points[14]; // 右脸颊
    const nose = points[30];       // 鼻尖
    
    // 左脸颊腮红
    ctx.beginPath();
    ctx.arc(leftCheek.x, leftCheek.y + 30, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
    ctx.fill();
    
    // 右脸颊腮红
    ctx.beginPath();
    ctx.arc(rightCheek.x, rightCheek.y + 30, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
    ctx.fill();
    
    // 鼻子到嘴唇的线条
    ctx.beginPath();
    ctx.moveTo(nose.x, nose.y);
    ctx.lineTo(nose.x, nose.y + 30);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ff9966';
    ctx.stroke();
    
    // 猫须
    const whiskerLength = 80;
    
    // 左上边须
    ctx.beginPath();
    ctx.moveTo(nose.x - 20, nose.y + 10);
    ctx.lineTo(nose.x - 20 - whiskerLength, nose.y + 5);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    ctx.stroke();
    
    // 左下边须
    ctx.beginPath();
    ctx.moveTo(nose.x - 20, nose.y + 20);
    ctx.lineTo(nose.x - 20 - whiskerLength, nose.y + 25);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    ctx.stroke();
    
    // 右上边须
    ctx.beginPath();
    ctx.moveTo(nose.x + 20, nose.y + 10);
    ctx.lineTo(nose.x + 20 + whiskerLength, nose.y + 5);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    ctx.stroke();
    
    // 右下边须
    ctx.beginPath();
    ctx.moveTo(nose.x + 20, nose.y + 20);
    ctx.lineTo(nose.x + 20 + whiskerLength, nose.y + 25);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    ctx.stroke();
  };

  // 绘制瞳孔特效
  const drawPupils = (ctx, points) => {
    const leftEye = points[36];   // 左眼左角
    const rightEye = points[45];  // 右眼右角
    
    // 计算眼睛中心
    const leftEyeCenter = {
      x: (points[36].x + points[39].x) / 2,
      y: (points[37].y + points[41].y) / 2
    };
    
    const rightEyeCenter = {
      x: (points[42].x + points[45].x) / 2,
      y: (points[43].y + points[47].y) / 2
    };
    
    // 绘制左瞳孔
    ctx.beginPath();
    ctx.arc(leftEyeCenter.x, leftEyeCenter.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#4a90e2';
    ctx.fill();
    
    // 左瞳孔高光
    ctx.beginPath();
    ctx.arc(leftEyeCenter.x - 5, leftEyeCenter.y - 5, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // 绘制右瞳孔
    ctx.beginPath();
    ctx.arc(rightEyeCenter.x, rightEyeCenter.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#4a90e2';
    ctx.fill();
    
    // 右瞳孔高光
    ctx.beginPath();
    ctx.arc(rightEyeCenter.x - 5, rightEyeCenter.y - 5, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  };

  return (
    <div className="ar-effects-container">
      <canvas
        ref={canvasRef}
        className="ar-effects-canvas"
      />
      
      <style jsx>{`
        .ar-effects-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 10;
        }
        
        .ar-effects-canvas {
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

export default AREffects;