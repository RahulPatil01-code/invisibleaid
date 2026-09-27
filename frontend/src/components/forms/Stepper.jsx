import React from 'react';
import { Check } from 'lucide-react';

export default function Stepper({ steps, currentStep, onStepClick }) {
  return (
    <nav aria-label="Progress" className="mb-8 overflow-x-auto pb-4">
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step.label} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              {index !== steps.length - 1 && (
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                </div>
              )}
              <button
                onClick={() => onStepClick && onStepClick(index)}
                disabled={!onStepClick}
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-default"
                style={{
                  borderWidth: '2px',
                  borderColor: isCompleted ? '#16A34A' : isCurrent ? '#0D9488' : '#D1D5DB',
                  backgroundColor: isCompleted ? '#16A34A' : 'white'
                }}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                ) : (
                  <span
                    className="text-sm font-medium"
                    style={{ color: isCurrent ? '#0D9488' : '#6B7280' }}
                  >
                    {index + 1}
                  </span>
                )}
                <span className="sr-only">{step.label}</span>
              </button>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-max text-center">
                <span className={`text-xs font-medium ${isCurrent ? 'text-teal-600' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
