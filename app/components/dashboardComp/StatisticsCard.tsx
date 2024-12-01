import React from 'react'
import { 
    Heart,
    Activity,
    Award,
    BookOpen,
   
  } from 'lucide-react';

function StatisticsCard() {
  return (
    <div className="dark:bg-darkBox  bg-neutral-400 rounded-xl shadow-lg p-6 md:col-span-3">
    <div className="flex items-center mb-6 border-b pb-4">
      <Activity className="w-6 h-6 mr-3 text-green-600" />
      <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-100">Blog Statistics</h2>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { icon: BookOpen, label: 'Total Posts', value: '6' },
        { icon: Award, label: 'Total Views', value: '2' },
        { icon: Heart, label: 'Total Likes', value: '10' }
      ].map((stat, index) => (
        <div 
          key={index} 
          className="bg-neutral-300 dark:bg-neutral-900 rounded-lg p-5 text-center hover:shadow-md transition"
        >
          <div className="flex justify-center mb-3">
            <stat.icon className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs uppercase tracking-wide text-gray-700 dark:text-neutral-200 mb-2">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-neutral-300">{stat.value}</p>
        </div>
      ))}
    </div>
  </div>
  )
}

export default StatisticsCard