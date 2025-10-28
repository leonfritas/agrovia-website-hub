import { NextRequest, NextResponse } from 'next/server';
import { prisma as prismaDB } from '@/utils/prismaDB';
import type { Video, Categoria } from '@prisma/client';

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
      imagemThumb: "/images/agrovia-inspira1.jpg",
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
      imagemThumb: "/images/agrovia-inspira2.jpg",
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
      imagemThumb: "/images/agrovia-conversa1.jpg",
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
      imagemThumb: "/images/agrovia-conversa2.jpg",
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
    
    let videosRelevantes: any[] = [];
    let source = 'database';
    
    try {
      // Tentar buscar do banco de dados
      const whereClause = categoria 
        ? { 
            categoria: {
              nomeCategoria: categoria
            }
          }
        : {};
        
      const videosDB = await prismaDB.video.findMany({
        where: whereClause,
        include: {
          categoria: true
        },
        orderBy: {
          dataUpload: 'desc'
        }
      });
      if (videosDB.length > 0) {
        videosRelevantes = videosDB.map((video: Video & { categoria: Categoria }) => ({
          idVideo: video.idVideo,
          nomeVideo: video.nomeVideo,
          descricao: video.descricao,
          urlArquivo: video.urlArquivo,
          urlExterno: video.urlExterno,
          nomeAutor: video.nomeAutor,
          cargoAutor: video.cargoAutor,
          dataUpload: video.dataUpload.toISOString(),
          categoria: {
            idCategoria: video.categoria.idCategoria,
            nomeCategoria: video.categoria.nomeCategoria
          }
        }));
        source = 'database';
        console.log('API Videos: Vídeos encontrados no banco:', videosRelevantes.length);
      } else {
        console.log('API Videos: Nenhum vídeo encontrado no banco, usando dados mockados');
        // Fallback para dados mockados se não há dados no banco
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
      console.error('API Videos: Erro no banco de dados:', dbError);
      
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
    
    console.log('API Videos: Vídeos retornados:', videosRelevantes.length, 'fonte:', source);
    
    return NextResponse.json({
      success: true,
      videos: videosRelevantes,
      source: source
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
