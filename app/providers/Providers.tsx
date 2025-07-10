'use client'

import { Provider } from 'react-redux'
import { store } from '../store/store'
import { AuthProvider } from './AuthProvider'
import { TokenErrorProvider } from './TokenErrorProvider'
import { useEffect } from 'react'
import { useTokenError } from './TokenErrorProvider'

function TokenErrorListener() {
  const { showTokenError } = useTokenError()

  useEffect(() => {
    const handleTokenError = (event: CustomEvent<{ message: string }>) => {
      showTokenError(event.detail.message)
    }

    window.addEventListener('token-error', handleTokenError as EventListener)
    return () => {
      window.removeEventListener('token-error', handleTokenError as EventListener)
    }
  }, [showTokenError])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <TokenErrorProvider>
        <AuthProvider>
          <TokenErrorListener />
          {children}
        </AuthProvider>
      </TokenErrorProvider>
    </Provider>
  )
} 