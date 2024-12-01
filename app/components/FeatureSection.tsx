import React from 'react';
import { 
  Lightbulb, 
  Zap, 
  Rocket, 
  BookOpen, 
  Layers, 
  PenTool 
} from 'lucide-react';

const extendedFeatures = [
  {
    title: "AI-Powered Writing Assistant",
    description: "Intelligent suggestions and real-time editing to elevate your writing.",
    icon: <Lightbulb className="w-12 h-12 text-blue-600" />,
    color: "bg-blue-50"
  },
  {
    title: "Advanced Grammar Checker",
    description: "Comprehensive language analysis with instant corrections.",
    icon: <PenTool className="w-12 h-12 text-green-600" />,
    color: "bg-green-50"
  },
  {
    title: "Style & Tone Optimizer",
    description: "Refine your writing style for different audiences and contexts.",
    icon: <Rocket className="w-12 h-12 text-purple-600" />,
    color: "bg-purple-50"
  },
  {
    title: "Research & Citation Tools",
    description: "Seamless integration of sources with automatic citation generation.",
    icon: <BookOpen className="w-12 h-12 text-indigo-600" />,
    color: "bg-indigo-50"
  },
  {
    title: "Collaboration Workspace",
    description: "Real-time editing and feedback with team members.",
    icon: <Layers className="w-12 h-12 text-teal-600" />,
    color: "bg-teal-50"
  },
  {
    title: "Performance Analytics",
    description: "Detailed insights into your writing progress and productivity.",
    icon: <Zap className="w-12 h-12 text-orange-600" />,
    color: "bg-orange-50"
  }
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Advanced Features for Writers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empower your writing journey with our comprehensive toolkit designed to transform your creative process
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {extendedFeatures.map((feature, index) => (
            <div 
              key={index} 
              className={`
                ${feature.color} 
                rounded-2xl 
                p-6 
                flex 
                flex-col 
                items-center 
                text-center 
                space-y-4 
                border 
                border-transparent 
                hover:scale-105 
                hover:rotate-1 
                hover:border-gray-200 
                hover:shadow-2xl 
                transition-all 
                duration-500 
                ease-in-out
                group
              `}
            >
              <div className="p-4 rounded-full bg-white shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-in-out">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;