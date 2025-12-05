export interface PinData {
  id: string;
  originalUrl: string; // The pinterest link
  mediaUrl: string | null; // The direct image/video link
  mediaType: 'image' | 'video' | 'unknown';
  description: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
  aiMetadata?: AiMetadata;
  blob?: Blob; // The downloaded file blob for user download
}

export interface AiMetadata {
  title: string;
  caption: string;
  hashtags: string[];
  isLoading: boolean;
}

export enum ProcessStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}
