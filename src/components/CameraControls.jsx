import React from 'react';

const CameraControls = ({ onTakePhoto, onStartRecord, onStopRecord, isRecording }) => {
  return (
    <div className="camera-controls">
      <div className="capture-section">
        {!isRecording ? (
          <button 
            className="capture-button photo-button"
            onClick={onTakePhoto}
            title="拍照"
          >
            📷
          </button>
        ) : (
          <button 
            className="capture-button record-stop-button"
            onClick={onStopRecord}
            title="停止录像"
          >
            ⏹️
          </button>
        )}
        
        {!isRecording && (
          <button 
            className="capture-button record-button"
            onClick={onStartRecord}
            title="开始录像"
          >
            🎥
          </button>
        )}
      </div>
      
      <style jsx>{`
        .camera-controls {
          position: absolute;
          bottom: 200px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }
        
        .capture-section {
          display: flex;
          gap: 30px;
          align-items: center;
        }
        
        .capture-button {
          width: 80px;
          height: 80px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .photo-button {
          background: rgba(255, 255, 255, 0.9);
          color: #ff6b6b;
        }
        
        .photo-button:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
        }
        
        .record-button {
          background: rgba(255, 255, 255, 0.9);
          color: #4ecdc4;
        }
        
        .record-button:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(76, 205, 196, 0.4);
        }
        
        .record-stop-button {
          background: rgba(255, 107, 107, 0.9);
          color: white;
          animation: pulse 1s infinite;
        }
        
        .record-stop-button:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.6);
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(255, 107, 107, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default CameraControls;