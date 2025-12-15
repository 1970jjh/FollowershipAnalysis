import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ReferenceArea, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

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
          fontSize={11} 
          fontWeight="bold"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full flex flex-col items-center my-8 print:my-4 print:break-inside-avoid">
      <div className="relative w-full aspect-square max-w-[600px] bg-white border-4 border-gray-600 p-2 sm:p-6 shadow-brutal print:shadow-none print:border-2">
        
        {/* Top Label */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 font-black text-black flex flex-col items-center z-10 w-full text-center">
          <span className="text-sm sm:text-lg bg-white px-2">독립/비판적 사고 (B)</span>
          <span className="text-xs">▲</span>
        </div>
        
        {/* Bottom Label */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-black text-black flex flex-col items-center z-10 w-full text-center">
          <span className="text-xs">▼</span>
          <span className="text-sm sm:text-lg bg-white px-2">의존/무비판적 사고 (B)</span>
        </div>

        {/* Left Label */}
        <div className="absolute top-1/2 -left-12 -translate-y-1/2 font-black text-black flex items-center -rotate-90 origin-center whitespace-nowrap z-10">
           <span className="text-sm sm:text-lg bg-white px-2">수동적 참여 (A)</span>
        </div>

        {/* Right Label */}
         <div className="absolute top-1/2 -right-12 -translate-y-1/2 font-black text-black flex items-center rotate-90 origin-center whitespace-nowrap z-10">
           <span className="text-sm sm:text-lg bg-white px-2">능동적 참여 (A)</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
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
            {/* Top Left: Alienated (Pos: y=45) */}
            {/* We use y1=40, y2=50 to center it at 45, avoiding the pragmatic box line at 40 */}
            <ReferenceArea x1={10} x2={30} y1={40} y2={50} fill="transparent" stroke="none">
               <Label value="소외형 팔로워" position="center" fill="#4b5563" fontSize={16} fontWeight={900} />
            </ReferenceArea>

            {/* Top Right: Exemplary/Judohyeong (Pos: y=45) */}
            <ReferenceArea x1={30} x2={50} y1={40} y2={50} fill="transparent" stroke="none">
               <Label value="주도형 팔로워" position="center" fill="#2563eb" fontSize={16} fontWeight={900} />
            </ReferenceArea>

            {/* Bottom Left: Passive (Pos: y=15) */}
            {/* We use y1=10, y2=20 to center it at 15, avoiding the pragmatic box line at 20 */}
            <ReferenceArea x1={10} x2={30} y1={10} y2={20} fill="transparent" stroke="none">
               <Label value="수동형 팔로워" position="center" fill="#dc2626" fontSize={16} fontWeight={900} />
            </ReferenceArea>

            {/* Bottom Right: Conformist (Pos: y=15) */}
            <ReferenceArea x1={30} x2={50} y1={10} y2={20} fill="transparent" stroke="none">
               <Label value="순응형 팔로워" position="center" fill="#ca8a04" fontSize={16} fontWeight={900} />
            </ReferenceArea>
            
            {/* Center Box: Pragmatic (20-40) */}
            {/* Using ReferenceArea to draw the box outline */}
            <ReferenceArea x1={20} x2={40} y1={20} y2={40} fill="white" fillOpacity={0.7} stroke="#059669" strokeWidth={3} strokeDasharray="5 5" />
            
            {/* Pragmatic Label inside the box (Pos: Center 30,30) */}
            <ReferenceArea x1={20} x2={40} y1={20} y2={40} fill="transparent" stroke="none">
               <Label value="실무형 팔로워" position="center" fill="#059669" fontSize={18} fontWeight={900} />
            </ReferenceArea>

            <Scatter name="My Score" data={data} fill="#ff0000">
               {/* Custom Dot */}
               <symbol id="myDot" viewBox="0 0 100 100" width="20" height="20">
                  <circle cx="50" cy="50" r="40" fill="red" stroke="white" strokeWidth="5" className="animate-pulse" />
               </symbol>
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* User Point Indicator styling */}
        <div className="absolute top-2 right-2 flex items-center gap-2 bg-white px-2 py-1 border border-gray-300 rounded shadow-sm text-xs print:hidden">
          <div className="w-3 h-3 rounded-full bg-red-600 border border-white"></div>
          <span>내 위치</span>
        </div>
      </div>
    </div>
  );
};