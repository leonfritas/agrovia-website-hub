const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar pasta uploads se não existir
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    // Remove caracteres especiais do nome
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, safeName + '-' + uniqueSuffix + ext);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Use apenas: JPEG, PNG, GIF ou WebP'), false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

// Middleware para múltiplos campos de imagem
const uploadPostImages = upload.fields([
  { name: 'imagemPost', maxCount: 1 },
  { name: 'imagemDestaque', maxCount: 1 },
  { name: 'imagemConteudo', maxCount: 1 }
]);

// Middleware para uma única imagem
const uploadSingleImage = upload.single('imagem');

module.exports = {
  uploadPostImages,
  uploadSingleImage,
  upload
};
