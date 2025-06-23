'use client';

import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url, options = {}) => {
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(0);
  const [error, setError] = useState(null);
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  const {
    onOpen = () => {},
    onClose = () => {},
    onMessage = () => {},
    onError = () => {},
    shouldReconnect = true,
    reconnectAttempts: maxReconnectAttempts = 5,
    reconnectInterval = 3000,
  } = options;

  const connect = () => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = (event) => {
        console.log('WebSocket connected');
        setReadyState(1);
        setError(null);
        reconnectAttempts.current = 0;
        onOpen(event);
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket disconnected');
        setReadyState(3);
        onClose(event);

        // Attempt to reconnect if enabled and not manually closed
        if (shouldReconnect && !event.wasClean && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          onMessage(data);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
          setLastMessage({ type: 'raw', data: event.data });
          onMessage({ type: 'raw', data: event.data });
        }
      };

      ws.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError(event);
        onError(event);
      };

      setReadyState(0);
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError(err);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (ws.current) {
      ws.current.close(1000, 'Manual disconnect');
    }
  };

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      ws.current.send(messageStr);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url]);

  return {
    lastMessage,
    readyState,
    error,
    sendMessage,
    disconnect,
  };
};