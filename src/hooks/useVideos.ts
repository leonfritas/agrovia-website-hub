import { useState, useEffect } from 'react';

export interface Video {
  idVideo: number;
  nomeVideo: string;
  descricao: string;
  urlArquivo?: string;
  urlExterno?: string;
  urlCapa?: string;
  nomeAutor?: string;
  cargoAutor?: string;
  dataUpload: string;
  categoria?: {
    idCategoria: number;
    nomeCategoria: string;
  };
}

export function useVideos(categoria?: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (categoria) {
          params.append('categoria', categoria);
        }
        
        const response = await fetch(`/api/videos-v2?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setVideos(data.videos);
          setSource(data.source || 'database');
          
          // Log para debug
          console.log(`Vídeos carregados (${categoria}):`, {
            quantidade: data.videos.length,
            fonte: data.source || 'database',
            videos: data.videos
          });
        } else {
          setError(data.error || 'Erro ao carregar vídeos');
        }
      } catch (err) {
        console.error('Erro ao buscar vídeos:', err);
        setError('Erro de conexão');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [categoria]);

  return { videos, loading, error, source };
}
