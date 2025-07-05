'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

import type { RegistrationStep1Data, RegistrationStep2Data, CompleteRegistrationData } from '../schemas'

import { RegistrationStep1, RegistrationStep2, RegistrationStep3, RegistrationStep4 } from '.'

export type RegistrationStep = 1 | 2 | 3 | 4

interface MultiStepRegisterFormProps {
  onComplete?: () => void
}

export function MultiStepRegisterForm({ onComplete }: MultiStepRegisterFormProps) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)
  const [step1Data, setStep1Data] = useState<RegistrationStep1Data | null>(null)
  const [step2Data, setStep2Data] = useState<RegistrationStep2Data | null>(null)
  const [completeData, setCompleteData] = useState<CompleteRegistrationData | null>(null)

  const handleStep1Complete = (data: RegistrationStep1Data) => {
    setStep1Data(data)
    setCurrentStep(2)
  }

  const handleStep2Complete = (data: RegistrationStep2Data) => {
    setStep2Data(data)
    
    // Combine step 1 and step 2 data
    if (step1Data) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...step1WithoutConfirm } = step1Data
      const combined: CompleteRegistrationData = {
        ...step1WithoutConfirm,
        rfidId: data.rfidId,
      }
      setCompleteData(combined)
      setCurrentStep(3)
    }
  }

  const handleStep3Confirm = () => {
    setCurrentStep(4)
  }

  const handleBackToStep = (step: RegistrationStep) => {
    setCurrentStep(step)
  }

  const handleComplete = () => {
    onComplete?.()
  }

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  const getStepTitle = () => {
    switch (currentStep) {
    case 1:
      return 'Create Your Account'
    case 2:
      return 'Connect Your RFID'
    case 3:
      return 'Review Your Information'
    case 4:
      return 'Verify Your Email'
    default:
      return 'Registration'
    }
  }

  const getStepSubtitle = () => {
    switch (currentStep) {
    case 1:
      return 'Fill in your personal details to get started'
    case 2:
      return 'Tap your student ID to register your RFID card'
    case 3:
      return 'Review your information before submitting'
    case 4:
      return 'Enter the verification code sent to your email'
    default:
      return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                step < currentStep
                  ? 'bg-green-500 text-white'
                  : step === currentStep
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-600 text-gray-400'
              }`}
            >
              {step < currentStep ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step
              )}
            </div>
            {step < 4 && (
              <div
                className={`w-26 mx-auto h-0.5 flex-1 transition-all duration-300 ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{getStepTitle()}</h2>
        <p className="text-gray-400">{getStepSubtitle()}</p>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <RegistrationStep1
              onNext={handleStep1Complete}
              initialData={step1Data}
            />
          )}
          
          {currentStep === 2 && (
            <RegistrationStep2
              onNext={handleStep2Complete}
              onBack={() => handleBackToStep(1)}
              initialData={step2Data}
            />
          )}
          
          {currentStep === 3 && completeData && (
            <RegistrationStep3
              data={completeData}
              onConfirm={handleStep3Confirm}
              onBack={() => handleBackToStep(2)}
              onEdit={(step: RegistrationStep) => handleBackToStep(step)}
            />
          )}
          
          {currentStep === 4 && completeData && (
            <RegistrationStep4
              email={completeData.email}
              onComplete={handleComplete}
              onBack={() => handleBackToStep(3)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default MultiStepRegisterForm 