# tabelas de Chat:
CREATE TABLE event_participants (
    event_id INT,
    user_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES eventos(eventos_id),
    FOREIGN KEY (user_id) REFERENCES usersweb(usersweb_id)
);

-- Tabela de Mensagens do Chat de Grupo
CREATE TABLE group_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    content_type ENUM('text', 'image') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES eventos(eventos_id),
    FOREIGN KEY (user_id) REFERENCES usersweb(usersweb_id)
);

-- Tabela de Mensagens Privadas
CREATE TABLE private_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    content_type ENUM('text', 'image') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES usersweb(usersweb_id),
    FOREIGN KEY (receiver_id) REFERENCES usersweb(usersweb_id)
);

# atualizar campo da mensagem para aceitar emogis
ALTER TABLE group_messages
  MODIFY COLUMN content TEXT
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

  ALTER TABLE private_messages
  MODIFY COLUMN content TEXT
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;