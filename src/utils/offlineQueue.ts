import { Message } from "@/components/ChatMessage";

const OFFLINE_QUEUE_KEY = "friendlybot-offline-queue";

export interface QueuedMessage {
  id: string;
  content: string;
  timestamp: Date;
  retryCount: number;
}

export class OfflineMessageQueue {
  private queue: QueuedMessage[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(OFFLINE_QUEUE_KEY);
      if (saved) {
        this.queue = JSON.parse(saved).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.error("Failed to load offline queue:", error);
      this.queue = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error("Failed to save offline queue:", error);
    }
  }

  addMessage(content: string): string {
    const id = `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const queuedMessage: QueuedMessage = {
      id,
      content,
      timestamp: new Date(),
      retryCount: 0,
    };

    this.queue.push(queuedMessage);
    this.saveToStorage();

    // Request background sync if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Check if sync is supported before using it
        if ('sync' in registration) {
          return (registration as any).sync.register('background-sync-messages');
        }
      }).catch((error) => {
        console.log('Background sync registration failed:', error);
      });
    }

    return id;
  }

  removeMessage(id: string) {
    this.queue = this.queue.filter(msg => msg.id !== id);
    this.saveToStorage();
  }

  getQueue(): QueuedMessage[] {
    return [...this.queue];
  }

  retry(id: string) {
    const message = this.queue.find(msg => msg.id === id);
    if (message) {
      message.retryCount++;
      this.saveToStorage();
    }
  }

  clear() {
    this.queue = [];
    this.saveToStorage();
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

// Global instance
export const offlineQueue = new OfflineMessageQueue();

// Network status utilities
export const isOnline = (): boolean => navigator.onLine;

export const addNetworkListener = (callback: (online: boolean) => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};