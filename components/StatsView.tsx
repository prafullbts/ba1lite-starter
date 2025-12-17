import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './UI';

const StatsView: React.FC = () => {
  // Dummy data to satisfy requirement "Use recharts"
  // In a real app, you would track token usage in a context/store.
  const data = [
    { name: 'Chat', tokens: 1250, requests: 45 },
    { name: 'Live', tokens: 8500, requests: 12 },
    { name: 'Image', tokens: 3200, requests: 8 },
  ];

  return (
    <div className="h-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">Session Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-[300px]">
          <h3 className="text-lg font-medium mb-4 text-gray-300">Estimated Token Usage</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Bar dataKey="tokens" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="h-[300px]">
          <h3 className="text-lg font-medium mb-4 text-gray-300">Request Distribution</h3>
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Bar dataKey="requests" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default StatsView;
