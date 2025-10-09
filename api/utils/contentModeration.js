// Lista de palavras ofensivas (português e inglês)
const palavrasOfensivas = [
  // Palavrões comuns em português
  'porra', 'merda', 'caralho', 'puta', 'fdp', 'filho da puta',
  'buceta', 'cu', 'cuzao', 'cuzão', 'cacete', 'caraio', 'bosta',
  'arrombado', 'viado', 'bicha', 'veado', 'boiola',
  
  // Termos ofensivos
  'idiota', 'imbecil', 'burro', 'estupido', 'estúpido', 'retardado',
  'cretino', 'otario', 'otário', 'babaca', 'desgraçado', 'desgraçada',
  'miseravel', 'miserável', 'vagabundo', 'safado',
  
  // Ameaças e violência
  'matar', 'morrer', 'morte', 'suicidio', 'suicída', 'suicídio',
  'violencia', 'violência', 'estupro', 'assassinar', 'morra',
  
  // Discriminação
  'racista', 'nazista', 'fascista', 'xenofobico', 'xenofóbico',
  'homofobico', 'homofóbico', 'machista', 'misogino', 'misógino',
  
  // Palavrões em inglês
  'fuck', 'shit', 'bitch', 'asshole', 'damn', 'bastard',
  'dick', 'pussy', 'cock', 'cunt'
];

/**
 * Verifica se o texto contém palavras ofensivas
 */
function containsProfanity(texto) {
  const textoLower = texto.toLowerCase();
  return palavrasOfensivas.some(palavra => {
    // Usar regex para detectar a palavra como palavra completa
    const regex = new RegExp(`\\b${palavra}\\b`, 'i');
    return regex.test(textoLower);
  });
}

/**
 * Limpa palavras ofensivas do texto
 */
function cleanProfanity(texto) {
  let textoLimpo = texto;
  palavrasOfensivas.forEach(palavra => {
    const regex = new RegExp(`\\b${palavra}\\b`, 'gi');
    textoLimpo = textoLimpo.replace(regex, '*'.repeat(palavra.length));
  });
  return textoLimpo;
}

/**
 * Verifica se um texto contém conteúdo ofensivo
 * @param {string} texto - Texto a ser verificado
 * @returns {Object} - { isOffensive: boolean, reason: string, cleanText: string }
 */
function moderateContent(texto) {
  if (!texto || typeof texto !== 'string') {
    return {
      isOffensive: false,
      reason: null,
      cleanText: texto,
      score: 0
    };
  }

  const textoLower = texto.toLowerCase();
  let score = 0;
  const reasons = [];

  // Verificar palavras ofensivas
  if (containsProfanity(texto)) {
    score += 50;
    reasons.push('Contém palavras ofensivas');
  }

  // Verificar maiúsculas excessivas (GRITAR)
  const upperCaseRatio = (texto.match(/[A-Z]/g) || []).length / texto.length;
  if (upperCaseRatio > 0.7 && texto.length > 10) {
    score += 20;
    reasons.push('Texto em maiúsculas excessivas');
  }

  // Verificar caracteres repetidos excessivamente (!!!!!!, ?????)
  const repeatedChars = texto.match(/(.)\1{4,}/g);
  if (repeatedChars && repeatedChars.length > 0) {
    score += 15;
    reasons.push('Caracteres repetidos excessivamente');
  }

  // Verificar URLs suspeitas
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = texto.match(urlPattern);
  if (urls && urls.length > 2) {
    score += 30;
    reasons.push('Múltiplos links suspeitos');
  }

  // Verificar spam (muitos números)
  const numberRatio = (texto.match(/\d/g) || []).length / texto.length;
  if (numberRatio > 0.4 && texto.length > 20) {
    score += 25;
    reasons.push('Possível spam (muitos números)');
  }

  // Limpar o texto
  const cleanText = cleanProfanity(texto);

  // Determinar se é ofensivo baseado no score
  const isOffensive = score >= 50;

  return {
    isOffensive,
    reason: reasons.length > 0 ? reasons.join(', ') : null,
    cleanText,
    score,
    details: {
      containsProfanity: containsProfanity(texto),
      upperCaseRatio: Math.round(upperCaseRatio * 100),
      hasRepeatedChars: !!repeatedChars,
      urlCount: urls ? urls.length : 0,
      numberRatio: Math.round(numberRatio * 100)
    }
  };
}

/**
 * Limpa texto removendo palavras ofensivas
 * @param {string} texto - Texto a ser limpo
 * @returns {string} - Texto limpo
 */
function cleanText(texto) {
  if (!texto || typeof texto !== 'string') {
    return texto;
  }
  return cleanProfanity(texto);
}

/**
 * Verifica se um comentário deve ser aprovado automaticamente
 * @param {string} texto - Texto do comentário
 * @param {string} autor - Nome do autor
 * @returns {Object} - { autoApprove: boolean, reason: string }
 */
function shouldAutoApprove(texto, autor) {
  const moderation = moderateContent(texto);
  
  // Não aprovar automaticamente se for ofensivo
  if (moderation.isOffensive) {
    return {
      autoApprove: false,
      reason: moderation.reason,
      moderationData: moderation
    };
  }

  // Não aprovar se o texto for muito curto (possível spam)
  if (texto.length < 5) {
    return {
      autoApprove: false,
      reason: 'Comentário muito curto',
      moderationData: moderation
    };
  }

  // Não aprovar se o nome do autor for suspeito
  if (autor.length < 2) {
    return {
      autoApprove: false,
      reason: 'Nome de autor inválido',
      moderationData: moderation
    };
  }

  // Aprovar automaticamente se passar em todas as verificações
  if (moderation.score < 30) {
    return {
      autoApprove: true,
      reason: 'Comentário passou em todas as verificações',
      moderationData: moderation
    };
  }

  // Moderação manual para casos intermediários
  return {
    autoApprove: false,
    reason: 'Requer moderação manual (score intermediário)',
    moderationData: moderation
  };
}

module.exports = {
  moderateContent,
  cleanText,
  shouldAutoApprove
};
