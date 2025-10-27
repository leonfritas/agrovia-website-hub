import { NextRequest, NextResponse } from 'next/server';
import Video from '@/models/Video'; // Classe Video real
// import VideoMock from '@/models/VideoMock'; // Mock desabilitado

// Dados mockados como fallback
const mockVideos = {
  'Agrovia Inspira': [
    {
      idVideo: 1,
      nomeVideo: "Histórias de Sucesso no Campo",
      descricao: "Depoimentos de produtores que transformaram suas vidas através da agricultura sustentável.",
      urlArquivo: "/videos/agrovia-inspira1.mp4",
      dataUpload: "2024-01-15",
      nomeAutor: "Produtor Rural",
      cargoAutor: "Agricultor",
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
      nomeAutor: "Maria Oliveira",
      cargoAutor: "Cooperativa",
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
      nomeAutor: "Carlos Prado",
      cargoAutor: "Eng. Florestal",
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
      nomeAutor: "Marina Souza",
      cargoAutor: "Pesquisadora",
      categoria: {
        idCategoria: 2,
        nomeCategoria: "Agrovia Conversa"
      }
    }
  ]
};

export async function GET(request: NextRequest) {
  console.log('API Videos V2: Iniciando requisição');
  
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    
    console.log('API Videos V2: Categoria solicitada:', categoria);
    
    let videosRelevantes: any[] = [];
    let source = 'database';
    
    try {
      // Buscar do banco usando a classe Video real
      const videoModel = new Video();
      
      if (categoria) {
        // Buscar por categoria específica usando nome da categoria
        const videosDB = await videoModel.findByCategoriaName(categoria, { limit: 50 });
        
        if (videosDB && videosDB.length > 0) {
          videosRelevantes = videosDB.map((video: any) => ({
            idVideo: video.idVideo,
            nomeVideo: video.nomeVideo,
            descricao: video.descricao,
            urlArquivo: video.urlArquivo,
            urlExterno: video.urlExterno,
            urlCapa: video.urlCapa,
            nomeAutor: video.nomeAutor,
            cargoAutor: video.cargoAutor,
            dataUpload: video.dataUpload,
            categoria: {
              idCategoria: video.idCategoria,
              nomeCategoria: video.nomeCategoria
            }
          }));
          source = 'database';
          console.log('API Videos V2: Vídeos encontrados no banco:', videosRelevantes.length);
        }
      } else {
        // Buscar todos os vídeos
        const videosDB = await videoModel.findAllWithDetails({ limit: 50 });
        
        if (videosDB && videosDB.length > 0) {
          videosRelevantes = videosDB.map((video: any) => ({
            idVideo: video.idVideo,
            nomeVideo: video.nomeVideo,
            descricao: video.descricao,
            urlArquivo: video.urlArquivo,
            urlExterno: video.urlExterno,
            urlCapa: video.urlCapa,
            nomeAutor: video.nomeAutor,
            cargoAutor: video.cargoAutor,
            dataUpload: video.dataUpload,
            categoria: {
              idCategoria: video.idCategoria,
              nomeCategoria: video.nomeCategoria
            }
          }));
          source = 'database';
          console.log('API Videos V2: Todos os vídeos encontrados no banco:', videosRelevantes.length);
        }
      }
      
      // Se não encontrou vídeos no banco, usar fallback
      if (videosRelevantes.length === 0) {
        console.log('API Videos V2: Nenhum vídeo encontrado no banco, usando dados mockados');
        
        if (categoria && mockVideos[categoria as keyof typeof mockVideos]) {
          videosRelevantes = mockVideos[categoria as keyof typeof mockVideos];
        } else {
          videosRelevantes = [
            ...mockVideos['Agrovia Inspira'],
            ...mockVideos['Agrovia Conversa']
          ];
        }
        source = 'mock';
      }
      
    } catch (dbError) {
      console.error('API Videos V2: Erro no banco de dados:', dbError);
      
      // Fallback para dados mockados em caso de erro no banco
      if (categoria && mockVideos[categoria as keyof typeof mockVideos]) {
        videosRelevantes = mockVideos[categoria as keyof typeof mockVideos];
      } else {
        videosRelevantes = [
          ...mockVideos['Agrovia Inspira'],
          ...mockVideos['Agrovia Conversa']
        ];
      }
      source = 'mock';
    }
    
    console.log('API Videos V2: Vídeos retornados:', videosRelevantes.length, 'fonte:', source);
    
    return NextResponse.json({
      success: true,
      videos: videosRelevantes,
      source: source
    });
    
  } catch (error) {
    console.error('API Videos V2: Erro completo:', error);
    
    // Retornar erro 200 com sucesso false para não quebrar o frontend
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao carregar vídeos',
      videos: []
    });
  }
}
