// Utilitários de formatação (BR)

const onlyDigits = (value) => (value || '').toString().replace(/\D/g, '');

export function formatCNPJ(value) {
  const digits = onlyDigits(value).slice(0, 14);
  const len = digits.length;

  if (len === 0) return '';
  if (len <= 2) return digits;
  if (len <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (len <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (len <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  // 13-14
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function formatPhoneBR(value) {
  const digits = onlyDigits(value).slice(0, 11); // até 11 dígitos (celular)
  const len = digits.length;
  if (len === 0) return '';

  const ddd = digits.slice(0, 2);
  if (len <= 2) return `(${ddd}`; // abre parênteses enquanto digita DDD

  const rest = digits.slice(2);
  if (len <= 6) {
    // parcial: (11) 1234
    return `(${ddd}) ${rest}`;
  }

  if (len <= 10) {
    // telefone fixo: (11) 1234-5678
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  // celular 11 dígitos: (11) 91234-5678
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

export function stripNonDigits(value) {
  return onlyDigits(value);
}

// Funções para data/hora com fuso horário de São Paulo
export function getCurrentDateTimeSP() {
  // Retorna a data/hora atual no fuso horário de São Paulo (America/Sao_Paulo)
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return formatter.format(now);
}

export function getCurrentDateSP() {
  // Retorna apenas a data (YYYY-MM-DD) no fuso horário de São Paulo
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const formatted = formatter.format(now);
  // Converte DD/MM/YYYY para YYYY-MM-DD
  const [day, month, year] = formatted.split('/');
  return `${year}-${month}-${day}`;
}

export function getCurrentISO8601SP() {
  // Retorna timestamp ISO 8601 com offset de São Paulo (-03:00)
  const agora = new Date();
  
  // Calcula offset de SP (UTC-3, ou UTC-2 durante horário de verão)
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(agora);
  const map = {};
  parts.forEach(({ type, value }) => {
    map[type] = value;
  });
  
  const ano = map.year;
  const mes = map.month;
  const dia = map.day;
  const hora = map.hour;
  const minuto = map.minute;
  const segundo = map.second;
  
  // Calcula offset correto (SP é UTC-3 ou UTC-2 durante horário de verão)
  const dataUTC = new Date(`${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}Z`);
  const dataSP = new Date(agora);
  const offset = (dataSP - dataUTC) / (1000 * 60); // diferença em minutos
  
  const offsetHoras = Math.floor(Math.abs(offset) / 60);
  const offsetMinutos = Math.abs(offset) % 60;
  const offsetSinal = offset <= 0 ? '+' : '-';
  const offsetStr = `${offsetSinal}${String(offsetHoras).padStart(2, '0')}:${String(offsetMinutos).padStart(2, '0')}`;
  
  return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}${offsetStr}`;
}

export function getCurrentISOSP() {
  // Retorna ISO string com fuso horário de São Paulo (simplificado)
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const formatted = formatter.format(now);
  // Converte DD/MM/YYYY HH:MM:SS para ISO format com offset -03:00
  const parts = formatted.split(' ');
  const [day, month, year] = parts[0].split('/');
  const [hour, minute, second] = parts[1].split(':');
  return `${year}-${month}-${day}T${hour}:${minute}:${second}-03:00`;
}

export function formatarDataHoraSP(dataISO) {
  // Formata data ISO para exibição em São Paulo com hora/minuto/segundo
  if (!dataISO) return '-';
  
  let date;
  
  // Se for string de data (YYYY-MM-DD), converte para Date
  if (typeof dataISO === 'string' && !dataISO.includes('T')) {
    const [year, month, day] = dataISO.split('-');
    date = new Date(`${year}-${month}-${day}T12:00:00Z`); // Usa meio-dia UTC para não virar dia anterior
  } else {
    date = new Date(dataISO);
  }
  
  // Verifica se data é válida
  if (isNaN(date.getTime())) {
    return '-';
  }
  
  // Cria uma cópia da data e subtrai 3 horas (ajuste para São Paulo)
  // São Paulo é UTC-3 (ou UTC-2 durante horário de verão)
  const dataSP = new Date(date.getTime() - (3 * 60 * 60 * 1000));
  
  // Formata a data
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  return formatter.format(dataSP);
}
