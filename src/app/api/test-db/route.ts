import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Testando conexão com banco de dados...');
    
    // Importar a classe Video
    const Video = require('@/models/Video');
    const videoModel = new Video();
    
    // Tentar buscar dados reais
    console.log('🔍 Buscando vídeos da categoria "Agrovia Conversa"...');
    const videosConversa = await videoModel.findByCategoriaName('Agrovia Conversa', { limit: 5 });
    
    console.log('🔍 Buscando vídeos da categoria "Agrovia Inspira"...');
    const videosInspira = await videoModel.findByCategoriaName('Agrovia Inspira', { limit: 5 });
    
    return NextResponse.json({
      success: true,
      message: 'Conexão com banco funcionando!',
      data: {
        agroviaConversa: {
          quantidade: videosConversa.length,
          videos: videosConversa
        },
        agroviaInspira: {
          quantidade: videosInspira.length,
          videos: videosInspira
        },
        configuracoes: {
          server: process.env.DB_SERVER || 'não configurado',
          database: process.env.DB_DATABASE || 'não configurado',
          user: process.env.DB_USER || 'não configurado',
          port: process.env.DB_PORT || 'não configurado'
        }
      }
    });
    
  } catch (error: any) {
    console.error('❌ Erro no teste de conexão:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro na conexão com banco de dados',
      error: error.message,
      configuracoes: {
        server: process.env.DB_SERVER || 'não configurado',
        database: process.env.DB_DATABASE || 'não configurado',
        user: process.env.DB_USER || 'não configurado',
        port: process.env.DB_PORT || 'não configurado'
      },
      dica: 'Verifique se as variáveis de ambiente estão configuradas no arquivo .env'
    });
  }
}

