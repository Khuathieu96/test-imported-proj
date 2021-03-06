import React, { useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { Frame, PieceType, zoomState } from '../../types/types';
import { Frames } from '../Frames';
import { Pieces } from '../Pieces';
import { MiniBar } from './components/MiniBar';

type MiniMapProps = {
  miniBoard: { miniBoardScale: number; width: number; height: number };
  pieces: PieceType[];
  frames: Frame[];
  stageScale: number;
  handleDragMoveZoom: (e: any) => void;
  handleClickZoom: (e: any) => void;
  handleZoom: (value: string) => void;
  zoom: zoomState;
};

const MiniMap = ({
  miniBoard,
  pieces,
  frames,
  zoom,
  handleDragMoveZoom,
  handleClickZoom,
  handleZoom,
  stageScale,
}: MiniMapProps) => {
  const minStarX = Math.min(...[...pieces, ...frames].map((item) => item.x));
  const minStarY = Math.min(...[...pieces, ...frames].map((item) => item.y));
  const [hover, setHover] = useState(false);
  const [pinMiniMap, setPinMiniMap] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 1,
        boxShadow: '0 8px 16px 0 rgb(0 0 0 / 12%)',
        background: 'white',
        borderRadius: 4,
        width: 300,
        bottom: 20,
        right: 20,
      }}
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      {(hover || pinMiniMap) && (
        <>
          <div
            style={{
              width: 300,
              height: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stage
              width={miniBoard.width}
              height={miniBoard.height}
              scaleX={miniBoard.miniBoardScale}
              scaleY={miniBoard.miniBoardScale}
              listening={false}
            >
              <Layer listening={false}>
                <Frames
                  frames={frames.map((item) => ({
                    ...item,
                    x: item.x - minStarX,
                    y: item.y - minStarY,
                  }))}
                />
              </Layer>
              <Layer listening={false}>
                <Pieces
                  pieces={pieces.map((item) => ({
                    ...item,
                    x: item.x - minStarX,
                    y: item.y - minStarY,
                  }))}
                  handleDragStart={() => {}}
                  handleDragEnd={() => {}}
                />
              </Layer>
            </Stage>
          </div>

          <Stage
            perfectDrawEnabled={false}
            style={{ position: 'absolute', top: 0, left: 0 }}
            width={300}
            height={150}
            onClick={handleClickZoom}
            transformsEnabled={'position'}
          >
            <Layer perfectDrawEnabled={false}>
              <Rect
                perfectDrawEnabled={false}
                {...zoom}
                width={
                  (window.innerWidth * miniBoard.miniBoardScale) / stageScale
                }
                height={
                  (window.innerHeight * miniBoard.miniBoardScale) / stageScale
                }
                stroke={'black'}
                strokeWidth={zoom.hidden ? 0 : 1}
                draggable
                onDragMove={handleDragMoveZoom}
              />
            </Layer>
          </Stage>
        </>
      )}

      <div>
        <MiniBar
          stageScale={stageScale}
          handlePinMiniMap={() => setPinMiniMap((prevState) => !prevState)}
          handleSave={() => {
            localStorage.setItem('frames', JSON.stringify(frames));
            localStorage.setItem('pieces', JSON.stringify(pieces));
          }}
          handleZoom={handleZoom}
        />
      </div>
    </div>
  );
};

export default MiniMap;
