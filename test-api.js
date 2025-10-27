// Script para testar a API de vídeos
const http = require('http');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}

async function testAPI() {
  try {
    console.log('🧪 Testando API de vídeos...\n');
    
    // Testar Agrovia Conversa
    console.log('📹 Testando Agrovia Conversa...');
    const data1 = await makeRequest('http://localhost:3000/api/videos-v2?categoria=Agrovia%20Conversa');
    
    console.log(`Sucesso: ${data1.success}`);
    console.log(`Fonte: ${data1.source || 'N/A'}`);
    console.log(`Vídeos encontrados: ${data1.videos?.length || 0}`);
    
    if (data1.videos && data1.videos.length > 0) {
      console.log('Vídeos:');
      data1.videos.forEach(video => {
        console.log(`- ${video.nomeVideo} (ID: ${video.idVideo})`);
      });
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Testar Agrovia Inspira
    console.log('📹 Testando Agrovia Inspira...');
    const data2 = await makeRequest('http://localhost:3000/api/videos-v2?categoria=Agrovia%20Inspira');
    
    console.log(`Sucesso: ${data2.success}`);
    console.log(`Fonte: ${data2.source || 'N/A'}`);
    console.log(`Vídeos encontrados: ${data2.videos?.length || 0}`);
    
    if (data2.videos && data2.videos.length > 0) {
      console.log('Vídeos:');
      data2.videos.forEach(video => {
        console.log(`- ${video.nomeVideo} (ID: ${video.idVideo})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
  }
}

testAPI();