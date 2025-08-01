'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import TokenErrorModal from '../components/TokenErrorModal'

interface TokenErrorContextType {
  showTokenError: (message: string) => void
}

const TokenErrorContext = createContext<TokenErrorContextType | undefined>(undefined)

export function TokenErrorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const showTokenError = (message: string) => {
    setErrorMessage(message)
    setIsOpen(true)
  }

  return (
    <TokenErrorContext.Provider value={{ showTokenError }}>
      {children}
      <TokenErrorModal isOpen={isOpen} message={errorMessage} />
    </TokenErrorContext.Provider>
  )
}

export function useTokenError() {
  const context = useContext(TokenErrorContext)
  if (context === undefined) {
    throw new Error('useTokenError must be used within a TokenErrorProvider')
  }
  return context
} 