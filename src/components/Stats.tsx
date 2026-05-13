import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Rocket, Award } from 'lucide-react';

const stats = [
  { label: 'Total Members', value: '5,000+', icon: Users, color: 'text-blue-400' },
  { label: 'Resources Ready', value: '1,200', icon: BookOpen, color: 'text-accent' },
  { label: 'Completed Projects', value: '450+', icon: Rocket, color: 'text-orange-400' },
  { label: 'Active Alumni', value: '2,500', icon: Award, color: 'text-gold' },
];

export const Stats = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div 
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="text-center group"
            >
              <div className="flex justify-center mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <h3 className="text-4xl font-display font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
