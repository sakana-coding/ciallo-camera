import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const VirtualCharacter = ({ facialLandmarks, customization, characterImageUrl }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const characterRef = useRef(null);
  const imageRef = useRef(null);
  const [characterType, setCharacterType] = React.useState('catgirl'); // catgirl, robot, anime
  const [positionType, setPositionType] = React.useState('side'); // side, shoulder
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // 如果有自定义图片URL，显示图片
    if (characterImageUrl) {
      // 创建图片元素
      const img = document.createElement('img');
      img.src = characterImageUrl;
      img.className = 'custom-character-image';
      img.style.position = 'absolute';
      img.style.width = '200px';
      img.style.height = 'auto';
      img.style.objectFit = 'contain';
      img.style.zIndex = '5';
      img.style.pointerEvents = 'none';
      
      img.onload = () => {
        setIsImageLoaded(true);
      };
      
      containerRef.current.appendChild(img);
      imageRef.current = img;
      
      // 清理函数
      return () => {
        if (containerRef.current && imageRef.current) {
          containerRef.current.removeChild(imageRef.current);
          imageRef.current = null;
        }
      };
    } 
    // 否则显示3D模型
    else {
      // 初始化场景
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000, 0); // 透明背景
      sceneRef.current = scene;

      // 初始化相机
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      camera.position.y = 1;
      cameraRef.current = camera;

      // 初始化渲染器，禁用所有可能的调试日志
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        debug: false, // 禁用调试模式
        powerPreference: 'high-performance', // 高性能模式
        preserveDrawingBuffer: false, // 减少内存使用
        stencil: false, // 禁用stencil缓冲区
        depth: true, // 保持深度缓冲区
        failIfMajorPerformanceCaveat: false // 允许在性能受限设备上运行
      });
      
      // 禁用Three.js的所有调试输出
      if (renderer.debug) {
        renderer.debug.checkShaderErrors = false;
        renderer.debug.checkUniformErrors = false;
        renderer.debug.checkTextureErrors = false;
      }
      
      // 禁用物理光照和其他高级特性
      renderer.physicallyCorrectLights = false;
      renderer.outputEncoding = THREE.LinearEncoding; // 使用简单的编码
      renderer.toneMapping = THREE.NoToneMapping; // 禁用色调映射
      renderer.shadowMap.enabled = false; // 禁用阴影映射
      renderer.shadowMap.type = THREE.BasicShadowMap; // 使用最简单的阴影映射
      
      // 禁用渲染器的统计信息
      if (renderer.info) {
        renderer.info.autoReset = false;
      }
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 添加光照
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 7.5);
      scene.add(directionalLight);

      // 创建角色组
      const character = new THREE.Group();
      characterRef.current = character;
      scene.add(character);

      // 根据类型创建角色
      createCharacter(character, characterType);

      // 动画循环
      const animate = () => {
        requestAnimationFrame(animate);
        
        // 更新角色位置
        updateCharacterPosition(character, facialLandmarks, positionType);
        
        // 角色轻微摆动
        character.rotation.y += 0.005;
        if (character.children[0]) {
          character.children[0].rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        }
        
        renderer.render(scene, camera);
      };
      animate();

      // 处理窗口大小变化
      const handleResize = () => {
        if (!cameraRef.current || !rendererRef.current) return;
        
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // 清理函数
      return () => {
        window.removeEventListener('resize', handleResize);
        if (containerRef.current && rendererRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement);
          rendererRef.current.dispose();
        }
      };
    }
  }, [characterType, customization, characterImageUrl]);

  // 图片位置更新
  useEffect(() => {
    if (!facialLandmarks || !characterImageUrl || !imageRef.current) return;

    const updateImagePosition = () => {
      // 获取面部关键点
      const points = facialLandmarks.positions;
      const videoWidth = 1280;
      const videoHeight = 720;
      
      // 计算缩放比例
      const scale = Math.max(window.innerWidth / videoWidth, window.innerHeight / videoHeight);
      
      // 获取鼻子位置（面部中心）
      const nose = points[30];
      const faceCenterX = nose.x * scale;
      const faceCenterY = nose.y * scale;
      
      // 根据位置类型设置图片位置
      let imageX, imageY;
      switch (positionType) {
        case 'side':
          // 站在用户右侧
          imageX = (faceCenterX / window.innerWidth - 0.5) * 2 + 1.5;
          imageY = (faceCenterY / window.innerHeight - 0.5) * -2 - 0.5;
          break;
        case 'shoulder':
          // 坐在用户左肩膀上
          imageX = (faceCenterX / window.innerWidth - 0.5) * 2 - 0.8;
          imageY = (faceCenterY / window.innerHeight - 0.5) * -2 + 0.5;
          break;
        default:
          imageX = (faceCenterX / window.innerWidth - 0.5) * 2 + 1.5;
          imageY = (faceCenterY / window.innerHeight - 0.5) * -2 - 0.5;
      }
      
      // 将相对坐标转换为像素坐标
      const pixelX = (imageX + 1) / 2 * window.innerWidth - 100; // 100是图片宽度的一半
      const pixelY = (-imageY + 1) / 2 * window.innerHeight - 150; // 150是估计的图片高度的一半
      
      if (imageRef.current) {
        imageRef.current.style.left = `${pixelX}px`;
        imageRef.current.style.top = `${pixelY}px`;
      }
    };
    
    updateImagePosition();
  }, [facialLandmarks, positionType, characterImageUrl]);

  // 根据类型创建角色
  const createCharacter = (group, type) => {
    // 清空现有角色，使用更高效的方式
    while (group.children.length > 0) {
      const child = group.children[0];
      // 清理几何体和材质，避免内存泄漏
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        // 处理材质数组
        if (Array.isArray(child.material)) {
          child.material.forEach(material => material.dispose());
        } else {
          child.material.dispose();
        }
      }
      group.remove(child);
    }

    switch (type) {
      case 'catgirl':
        createCatGirl(group);
        break;
      case 'robot':
        createRobot(group);
        break;
      case 'anime':
        createAnimeCharacter(group);
        break;
      default:
        createCatGirl(group);
    }
  };

  // 创建猫耳女孩角色
  const createCatGirl = (group) => {
    // 头部
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    group.add(head);

    // 猫耳
    const earGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
    const earMaterial = new THREE.MeshStandardMaterial({ color: 0xffccaa });
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.5, 1, 0);
    leftEar.rotation.z = Math.PI / 6;
    group.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.5, 1, 0);
    rightEar.rotation.z = -Math.PI / 6;
    group.add(rightEar);

    // 眼睛
    const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x4a90e2 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.3, 0.3, 0.8);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.3, 0.3, 0.8);
    group.add(rightEye);

    // 身体
    const bodyGeometry = new THREE.CylinderGeometry(0.8, 1, 1.5, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b9d });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = -1.8;
    group.add(body);
  };

  // 创建机器人角色
  const createRobot = (group) => {
    // 头部
    const headGeometry = new THREE.BoxGeometry(1.2, 1.5, 1.2);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    group.add(head);

    // 眼睛
    const eyeGeometry = new THREE.CircleGeometry(0.2, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.4, 0.3, 0.6);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.4, 0.3, 0.6);
    group.add(rightEye);

    // 身体
    const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = -2;
    group.add(body);
  };

  // 创建动漫角色
  const createAnimeCharacter = (group) => {
    // 头部
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    group.add(head);

    // 头发 - 使用自定义颜色
    const hairGeometry = new THREE.SphereGeometry(1.1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5);
    const hairMaterial = new THREE.MeshStandardMaterial({ color: customization.hairColor });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 0.2;
    group.add(hair);

    // 眼睛 - 使用自定义颜色
    const eyeGeometry = new THREE.SphereGeometry(0.18, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: customization.eyeColor });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.3, 0.3, 0.8);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.3, 0.3, 0.8);
    group.add(rightEye);

    // 身体 - 使用自定义颜色
    const bodyGeometry = new THREE.CylinderGeometry(0.7, 1, 1.5, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: customization.outfitColor });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = -1.8;
    group.add(body);
  };

  // 更新角色位置，实现智能定位
  const updateCharacterPosition = (group, landmarks, positionType) => {
    if (!landmarks || !group) return;

    // 获取面部关键点
    const points = landmarks.positions;
    const videoWidth = 1280;
    const videoHeight = 720;
    
    // 计算缩放比例
    const scale = Math.max(window.innerWidth / videoWidth, window.innerHeight / videoHeight);
    
    // 获取鼻子位置（面部中心）
    const nose = points[30];
    const faceCenterX = nose.x * scale;
    const faceCenterY = nose.y * scale;
    
    // 根据位置类型设置角色位置
    switch (positionType) {
      case 'side':
        // 站在用户右侧
        group.position.x = (faceCenterX / window.innerWidth - 0.5) * 2 + 1.5;
        group.position.y = (faceCenterY / window.innerHeight - 0.5) * -2 - 0.5;
        group.scale.set(1, 1, 1);
        break;
      case 'shoulder':
        // 坐在用户左肩膀上
        group.position.x = (faceCenterX / window.innerWidth - 0.5) * 2 - 0.8;
        group.position.y = (faceCenterY / window.innerHeight - 0.5) * -2 + 0.5;
        group.scale.set(0.5, 0.5, 0.5);
        break;
      default:
        group.position.x = (faceCenterX / window.innerWidth - 0.5) * 2 + 1.5;
        group.position.y = (faceCenterY / window.innerHeight - 0.5) * -2 - 0.5;
    }
  };

  return (
    <div className="virtual-character-container">
      <div className="character-controls">
        <div className="control-group">
          <label>角色类型：</label>
          <select value={characterType} onChange={(e) => setCharacterType(e.target.value)}>
            <option value="catgirl">猫耳女孩</option>
            <option value="robot">机器人</option>
            <option value="anime">动漫角色</option>
          </select>
        </div>
        <div className="control-group">
          <label>位置：</label>
          <select value={positionType} onChange={(e) => setPositionType(e.target.value)}>
            <option value="side">站在身边</option>
            <option value="shoulder">坐在肩膀</option>
          </select>
        </div>
      </div>
      <div ref={containerRef} className="three-container"></div>
      
      <style jsx>{`
        .virtual-character-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 5;
        }
        
        .three-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .character-controls {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          padding: 15px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          pointer-events: auto;
          z-index: 10;
        }
        
        .control-group {
          margin-bottom: 10px;
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
      `}</style>
    </div>
  );
};

export default VirtualCharacter;