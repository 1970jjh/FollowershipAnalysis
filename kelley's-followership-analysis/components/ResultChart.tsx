import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ReferenceArea, ReferenceLine, Label } from 'recharts';

interface ResultChartProps {
  scoreA: number; // 0-50
  scoreB: number; // 0-50
}

export const ResultChart: React.FC<ResultChartProps> = ({ scoreA, scoreB }) => {
  const data = [{ x: scoreA, y: scoreB }];

  // Custom Tick for axes
  const renderCustomAxisTick = ({ x, y, payload, orientation }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={orientation === 'bottom' ? 15 : 5}
          dy={0}
          textAnchor="middle"
          fill="#666"
          fontSize={10}
          fontWeight="bold"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // 고정 크기 차트 (PDF 캡처 호환)
  const chartContent = (
    <ScatterChart
      width={320}
      height={320}
      margin={{ top: 15, right: 15, bottom: 15, left: 15 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

      {/* X Axis: 10 to 50, Center at 30 */}
      <XAxis
        type="number"
        dataKey="x"
        domain={[10, 50]}
        ticks={[10, 20, 30, 40, 50]}
        tick={renderCustomAxisTick}
        tickLine={true}
        axisLine={{ stroke: '#555', strokeWidth: 2 }}
      />

      {/* Y Axis: 10 to 50, Center at 30 */}
      <YAxis
        type="number"
        dataKey="y"
        domain={[10, 50]}
        ticks={[10, 20, 30, 40, 50]}
        tick={(props) => renderCustomAxisTick({...props, orientation: 'left'})}
        tickLine={true}
        axisLine={{ stroke: '#555', strokeWidth: 2 }}
      />

      {/* Crosshair Lines at Center (30, 30) */}
      <ReferenceLine x={30} stroke="#333" strokeWidth={2} />
      <ReferenceLine y={30} stroke="#333" strokeWidth={2} />

      {/* Quadrant Labels */}
      {/* Top Left: Alienated */}
      <ReferenceArea x1={10} x2={30} y1={40} y2={50} fill="transparent" stroke="none">
         <Label value="소외형 팔로워" position="center" fill="#4b5563" fontSize={11} fontWeight={900} />
      </ReferenceArea>

      {/* Top Right: Exemplary */}
      <ReferenceArea x1={30} x2={50} y1={40} y2={50} fill="transparent" stroke="none">
         <Label value="주도형 팔로워" position="center" fill="#2563eb" fontSize={11} fontWeight={900} />
      </ReferenceArea>

      {/* Bottom Left: Passive */}
      <ReferenceArea x1={10} x2={30} y1={10} y2={20} fill="transparent" stroke="none">
         <Label value="수동형 팔로워" position="center" fill="#dc2626" fontSize={11} fontWeight={900} />
      </ReferenceArea>

      {/* Bottom Right: Conformist */}
      <ReferenceArea x1={30} x2={50} y1={10} y2={20} fill="transparent" stroke="none">
         <Label value="순응형 팔로워" position="center" fill="#ca8a04" fontSize={11} fontWeight={900} />
      </ReferenceArea>

      {/* Center Box: Pragmatic (20-40) */}
      <ReferenceArea x1={20} x2={40} y1={20} y2={40} fill="white" fillOpacity={0.7} stroke="#059669" strokeWidth={3} strokeDasharray="5 5" />

      {/* Pragmatic Label */}
      <ReferenceArea x1={20} x2={40} y1={20} y2={40} fill="transparent" stroke="none">
         <Label value="실무형 팔로워" position="center" fill="#059669" fontSize={12} fontWeight={900} />
      </ReferenceArea>

      <Scatter name="My Score" data={data} fill="#ff0000" />
    </ScatterChart>
  );

  return (
    <div className="w-full flex flex-col items-center my-4" id="followership-chart">
      <div className="relative bg-white border-2 border-gray-600 p-4" style={{ width: '380px', height: '380px' }}>

        {/* Top Label */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-black text-center text-sm">
          <span>독립/비판적 사고 (B)</span>
          <span className="block text-xs">▲</span>
        </div>

        {/* Bottom Label */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-bold text-black text-center text-sm">
          <span className="block text-xs">▼</span>
          <span>의존/무비판적 사고 (B)</span>
        </div>

        {/* Left Label */}
        <div className="absolute top-1/2 -left-16 -translate-y-1/2 font-bold text-black -rotate-90 whitespace-nowrap text-sm">
           수동적 참여 (A)
        </div>

        {/* Right Label */}
        <div className="absolute top-1/2 -right-16 -translate-y-1/2 font-bold text-black rotate-90 whitespace-nowrap text-sm">
           능동적 참여 (A)
        </div>

        {/* Chart */}
        <div className="w-full h-full flex items-center justify-center">
          {chartContent}
        </div>

        {/* Legend */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white px-2 py-1 border border-gray-300 rounded text-xs">
          <div className="w-2 h-2 rounded-full bg-red-600"></div>
          <span>내 위치</span>
        </div>
      </div>
    </div>
  );
};
