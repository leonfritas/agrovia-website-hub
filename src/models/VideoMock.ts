// Versão mock da classe Video para desenvolvimento
// Use esta versão até configurar a conexão real com SQL Server

export interface VideoData {
  idVideo?: number;
  nomeVideo: string;
  urlArquivo?: string | null;
  urlExterno?: string | null;
  descricao?: string | null;
  idUsuario: number;
  dataUpload?: Date;
  idCategoria: number;
  nomeAutor?: string | null;
  cargoAutor?: string | null;
}

export interface VideoWithDetails extends VideoData {
  nomeCategoria?: string;
  nomeUsuario?: string;
}

export interface VideoOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
}

// Dados mockados para simular o banco
const mockVideos: VideoWithDetails[] = [
  {
    idVideo: 1,
    nomeVideo: "Eng. Florestal Carlos Prado fala sobre reflorestamento e mercado de carbono",
    descricao: "Entrevista com o engenheiro florestal Carlos Prado sobre as oportunidades do mercado de carbono no Brasil e as práticas de reflorestamento mais eficazes para produtores rurais.",
    urlArquivo: "/videos/agrovia-conversa-1.mp4",
    nomeAutor: "Carlos Prado",
    cargoAutor: "Eng. Florestal",
    idUsuario: 1,
    dataUpload: new Date("2024-01-10"),
    idCategoria: 1,
    nomeCategoria: "Agrovia Conversa",
    nomeUsuario: "Admin"
  },
  {
    idVideo: 2,
    nomeVideo: "Profa. Marina Souza comenta práticas de ILPF no Centro-Oeste",
    descricao: "Conteúdo introdutório sobre Integração Lavoura-Pecuária-Floresta, desafios e ganhos de produtividade no médio prazo com a pesquisadora Marina Souza.",
    urlArquivo: "/videos/agrovia-conversa-2.mp4",
    nomeAutor: "Marina Souza",
    cargoAutor: "Pesquisadora",
    idUsuario: 1,
    dataUpload: new Date("2024-01-25"),
    idCategoria: 1,
    nomeCategoria: "Agrovia Conversa",
    nomeUsuario: "Admin"
  },
  {
    idVideo: 3,
    nomeVideo: "Seu João e os filhos - 40 anos de produção familiar em Goiás",
    descricao: "História inspiradora de uma família que mantém a tradição agrícola há quatro décadas, mostrando a importância da agricultura familiar no Brasil.",
    urlArquivo: "/videos/agrovia-inspira1.mp4",
    nomeAutor: "Jorge Santos",
    cargoAutor: "Produtor Rural",
    idUsuario: 1,
    dataUpload: new Date("2024-01-15"),
    idCategoria: 2,
    nomeCategoria: "Agrovia Inspira",
    nomeUsuario: "Admin"
  },
  {
    idVideo: 4,
    nomeVideo: "Dona Maria e a cooperativa - Histórias de superação e agricultura sustentável",
    descricao: "Depoimento emocionante sobre como as cooperativas agrícolas transformam vidas e promovem práticas sustentáveis no campo.",
    urlArquivo: "/videos/agrovia-inspira2.mp4",
    nomeAutor: "Maria Oliveira",
    cargoAutor: "Cooperativa",
    idUsuario: 1,
    dataUpload: new Date("2024-01-20"),
    idCategoria: 2,
    nomeCategoria: "Agrovia Inspira",
    nomeUsuario: "Admin"
  }
];

class VideoMock {
  private tableName: string;

  constructor() {
    this.tableName = 'Video';
    console.log('🔧 Usando VideoMock - dados simulados');
  }

  // Buscar video por ID
  async findById(id: number): Promise<VideoData | null> {
    console.log(`🔍 Buscando vídeo por ID: ${id}`);
    const video = mockVideos.find(v => v.idVideo === id);
    return video || null;
  }

  // Criar novo video
  async create(data: VideoData): Promise<VideoData> {
    console.log('➕ Criando novo vídeo:', data.nomeVideo);
    const newVideo: VideoWithDetails = {
      ...data,
      idVideo: Math.max(...mockVideos.map(v => v.idVideo || 0)) + 1,
      dataUpload: new Date(),
      nomeCategoria: data.idCategoria === 1 ? 'Agrovia Conversa' : 'Agrovia Inspira',
      nomeUsuario: 'Admin'
    };
    mockVideos.push(newVideo);
    return newVideo;
  }

  // Buscar videos por categoria
  async findByCategoria(idCategoria: number, options: VideoOptions = {}): Promise<VideoWithDetails[]> {
    const { limit = 10, offset = 0 } = options;
    console.log(`🔍 Buscando vídeos por categoria ID: ${idCategoria}, limit: ${limit}, offset: ${offset}`);
    
    const filteredVideos = mockVideos.filter(v => v.idCategoria === idCategoria);
    return filteredVideos.slice(offset, offset + limit);
  }

  // Buscar videos por nome da categoria
  async findByCategoriaName(nomeCategoria: string, options: VideoOptions = {}): Promise<VideoWithDetails[]> {
    const { limit = 10, offset = 0 } = options;
    console.log(`🔍 Buscando vídeos por categoria: "${nomeCategoria}", limit: ${limit}, offset: ${offset}`);
    
    const filteredVideos = mockVideos.filter(v => v.nomeCategoria === nomeCategoria);
    return filteredVideos.slice(offset, offset + limit);
  }

  // Buscar videos com informações completas
  async findAllWithDetails(options: VideoOptions = {}): Promise<VideoWithDetails[]> {
    const { limit = 10, offset = 0, orderBy = 'v.dataUpload', order = 'DESC' } = options;
    console.log(`🔍 Buscando todos os vídeos, limit: ${limit}, offset: ${offset}`);
    
    let sortedVideos = [...mockVideos];
    
    // Simular ordenação
    if (orderBy === 'v.dataUpload') {
      sortedVideos.sort((a, b) => {
        const dateA = a.dataUpload || new Date(0);
        const dateB = b.dataUpload || new Date(0);
        return order === 'DESC' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
      });
    }
    
    return sortedVideos.slice(offset, offset + limit);
  }

  // Buscar videos recentes
  async findRecent(limit: number = 5): Promise<VideoWithDetails[]> {
    console.log(`🔍 Buscando ${limit} vídeos recentes`);
    
    const sortedVideos = [...mockVideos].sort((a, b) => {
      const dateA = a.dataUpload || new Date(0);
      const dateB = b.dataUpload || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    return sortedVideos.slice(0, limit);
  }

  // Buscar videos por texto (busca em nome e descrição)
  async search(searchTerm: string, options: VideoOptions = {}): Promise<VideoWithDetails[]> {
    const { limit = 10, offset = 0 } = options;
    console.log(`🔍 Buscando vídeos com termo: "${searchTerm}"`);
    
    const filteredVideos = mockVideos.filter(v => 
      v.nomeVideo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.descricao && v.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return filteredVideos.slice(offset, offset + limit);
  }

  // Estatísticas de videos
  async getStats(): Promise<any> {
    console.log('📊 Calculando estatísticas dos vídeos');
    
    const totalVideos = mockVideos.length;
    const categoriasUsadas = new Set(mockVideos.map(v => v.idCategoria)).size;
    const usuariosAtivos = new Set(mockVideos.map(v => v.idUsuario)).size;
    const ultimoVideo = mockVideos.reduce((latest, video) => {
      const videoDate = video.dataUpload || new Date(0);
      const latestDate = latest.dataUpload || new Date(0);
      return videoDate > latestDate ? video : latest;
    }, mockVideos[0]);
    
    const videosComArquivo = mockVideos.filter(v => v.urlArquivo).length;
    const videosExternos = mockVideos.filter(v => v.urlExterno).length;
    
    return {
      totalVideos,
      categoriasUsadas,
      usuariosAtivos,
      ultimoVideo: ultimoVideo.dataUpload,
      videosComArquivo,
      videosExternos
    };
  }
}

export default VideoMock;
