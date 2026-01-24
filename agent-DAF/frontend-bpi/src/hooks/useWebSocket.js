import { useEffect, useRef, useState } from 'react'

export default function useWebSocket(url) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const ws = useRef(null)
  const reconnectTimeout = useRef(null)

  useEffect(() => {
    function connect() {
      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        console.log('✅ WebSocket connecté')
        setIsConnected(true)
      }

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
        } catch (e) {
          console.error('Erreur parsing WS:', e)
        }
      }

      ws.current.onclose = () => {
        console.log('🔌 WebSocket déconnecté, reconnexion...')
        setIsConnected(false)
        reconnectTimeout.current = setTimeout(connect, 3000)
      }

      ws.current.onerror = (err) => {
        console.error('❌ Erreur WebSocket:', err)
      }
    }

    connect()

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
      }
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url])

  return { isConnected, lastMessage }
}
