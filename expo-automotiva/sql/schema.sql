CREATE DATABASE IF NOT EXISTS expo_automotiva
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE expo_automotiva;

CREATE TABLE IF NOT EXISTS veiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  marca VARCHAR(80) NOT NULL,
  modelo VARCHAR(80) NOT NULL,
  ano SMALLINT UNSIGNED,
  categoria ENUM('Antigos','Esportivos','Modificados','Motocicletas') NOT NULL,
  descricao TEXT NOT NULL,
  imagem VARCHAR(255),
  destaque BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS atracoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  local VARCHAR(120) NOT NULL,
  imagem VARCHAR(255),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS programacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(140) NOT NULL,
  descricao TEXT NOT NULL,
  data_evento DATE NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME,
  local VARCHAR(120) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_programacao_data_hora (data_evento, horario_inicio)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inscricoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  telefone VARCHAR(25) NOT NULL,
  tipo_inscricao ENUM('Visitante','Expositor') NOT NULL DEFAULT 'Visitante',
  veiculo_id INT NULL,
  mensagem TEXT NULL,
  aceite_privacidade BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('Recebida','Confirmada','Cancelada') NOT NULL DEFAULT 'Recebida',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inscricao_veiculo FOREIGN KEY (veiculo_id)
    REFERENCES veiculos(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_inscricoes_email (email)
) ENGINE=InnoDB;

INSERT INTO veiculos (nome,marca,modelo,ano,categoria,descricao,imagem,destaque) VALUES
('Fusca Apocalipse 1974','Volkswagen','Fusca',1974,'Antigos','Um clássico com visual pós-apocalíptico, chapas soldadas, ferrugem cenográfica e faróis extras.','/assets/fusca-apocalipse.jpg',1),
('Supra Mutante','Toyota','Supra',1998,'Esportivos','Aerofólio gigantesco, pintura verde e roxa, entradas de ar sem função e rodas desproporcionais.','/assets/supra-mutante.jpg',1),
('Gol Pancadão Extremo','Volkswagen','Gol',2003,'Modificados','Som automotivo exagerado, cores conflitantes e acessórios que desafiam a aerodinâmica.','/assets/gol-pancadao.jpg',1),
('Moto Tiranossauro','Custom','Tiranossauro',2020,'Motocicletas','Uma moto temática com caveiras, escapamentos múltiplos e iluminação extravagante.','/assets/moto-tiranossauro.jpg',1),
('Chevrolet C10 Frankenstein','Chevrolet','C10',1982,'Antigos','Picape montada com peças de diferentes épocas, rodas enormes e acabamento excêntrico.','/assets/c10-frankenstein.jpg',0),
('Lambo Coelho Rosa','Lamborghini','Projeto Coelho',2012,'Esportivos','Revestimento rosa felpudo, orelhas gigantes e detalhes completamente inesperados.','/assets/lambo-coelho.jpg',0),
('Uno Tanque de Guerra','Fiat','Uno',1996,'Modificados','Esteiras cenográficas, blindagem falsa e visual militar exagerado.','/assets/uno-tanque.jpg',0),
('Moto Cyber Alien','Custom','Cyber Alien',2024,'Motocicletas','Carroceria angular, iluminação verde e acessórios de ficção científica.','/assets/moto-cyber.jpg',0);

INSERT INTO atracoes (nome,descricao,tipo,local,imagem) VALUES
('Desfile dos Projetos Insanos','Desfile dos veículos mais diferentes e extravagantes da exposição.','Desfile','Pista Central','/assets/gol-pancadao.jpg'),
('Desafio de Som Automotivo','Demonstração e competição de som, com avaliação da organização.','Competição','Arena de Som','/assets/gol-pancadao.jpg'),
('Encontro de Motocicletas','Exposição de motos customizadas e encontro de motociclistas.','Encontro','Pavilhão 2','/assets/moto-tiranossauro.jpg'),
('Premiação Expo Sem Limites','Premiação simbólica para criatividade, originalidade e projeto mais inusitado.','Premiação','Palco Principal','/assets/uno-tanque.jpg');

INSERT INTO programacao (titulo,descricao,data_evento,horario_inicio,horario_fim,local) VALUES
('Abertura dos portões','Início da visitação do público.','2026-11-15','08:00:00','09:00:00','Entrada principal'),
('Abertura oficial e boas-vindas','Apresentação da organização e orientações gerais.','2026-11-15','09:00:00','09:30:00','Palco principal'),
('Exposição de veículos','Visitação aos veículos antigos, esportivos, modificados e motos.','2026-11-15','09:30:00','12:00:00','Pavilhões 1 e 2'),
('Desafio de som automotivo','Demonstrações e competição de som automotivo.','2026-11-15','14:00:00','16:00:00','Arena de Som'),
('Desfile dos projetos insanos','Desfile dos veículos selecionados pela organização.','2026-11-15','17:00:00','18:00:00','Pista Central'),
('Encontro de motocicletas','Exposição e bate-papo com motociclistas.','2026-11-16','10:00:00','12:00:00','Pavilhão 2'),
('Premiação Expo Sem Limites','Premiação dos projetos em destaque.','2026-11-16','16:00:00','17:00:00','Palco principal'),
('Encerramento','Agradecimentos e encerramento da edição.','2026-11-16','18:00:00','18:30:00','Palco principal');
