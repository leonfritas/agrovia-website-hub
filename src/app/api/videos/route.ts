import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://5acfae47b7cd.ngrok-free.app/api';

// Dados mockados para teste (temporário)
const mockVideos = {
  'Agrovia Inspira': [
    {
      idVideo: 1,
      nomeVideo: "Histórias de Sucesso no Campo",
      descricao: "Depoimentos de produtores que transformaram suas vidas através da agricultura sustentável.",
      urlArquivo: "/videos/agrovia-inspira1.mp4",
      dataUpload: "2024-01-15",
      categoria: {
        idCategoria: 1,
        nomeCategoria: "Agrovia Inspira"
      }
    },
    {
      idVideo: 2,
      nomeVideo: "Cooperativas que Fazem a Diferença",
      descricao: "Como as cooperativas agrícolas estão mudando a realidade do campo brasileiro.",
      urlArquivo: "/videos/agrovia-inspira2.mp4",
      dataUpload: "2024-01-20",
      categoria: {
        idCategoria: 1,
        nomeCategoria: "Agrovia Inspira"
      }
    }
  ],
  'Agrovia Conversa': [
    {
      idVideo: 3,
      nomeVideo: "Entrevista com Engenheiro Florestal",
      descricao: "Carlos Prado fala sobre reflorestamento e mercado de carbono no Brasil.",
      urlArquivo: "/videos/agrovia-conversa-1.mp4",
      dataUpload: "2024-01-10",
      categoria: {
        idCategoria: 2,
        nomeCategoria: "Agrovia Conversa"
      }
    },
    {
      idVideo: 4,
      nomeVideo: "ILPF no Centro-Oeste",
      descricao: "Profa. Marina Souza comenta práticas de Integração Lavoura-Pecuária-Floresta.",
      urlArquivo: "/videos/agrovia-conversa-2.mp4",
      dataUpload: "2024-01-25",
      categoria: {
        idCategoria: 2,
        nomeCategoria: "Agrovia Conversa"
      }
    }
  ]
};

export async function GET(request: NextRequest) {
  console.log('API Videos: Iniciando requisição');
  
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    
    console.log('API Videos: Categoria solicitada:', categoria);
    
    // Por enquanto, usar dados mockados
    let videosRelevantes: any[] = [];
    
    if (categoria && mockVideos[categoria as keyof typeof mockVideos]) {
      videosRelevantes = mockVideos[categoria as keyof typeof mockVideos];
    } else {
      // Retornar todos os vídeos mockados se não especificou categoria
      videosRelevantes = [
        ...mockVideos['Agrovia Inspira'],
        ...mockVideos['Agrovia Conversa']
      ];
    }
    
    console.log('API Videos: Vídeos mockados encontrados:', videosRelevantes.length);
    
    return NextResponse.json({
      success: true,
      videos: videosRelevantes,
      source: 'mock' // Indicar que são dados mockados
    });
    
  } catch (error) {
    console.error('API Videos: Erro completo:', error);
    
    // Retornar erro 200 com sucesso false para não quebrar o frontend
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao carregar vídeos',
      videos: []
    });
  }
}
