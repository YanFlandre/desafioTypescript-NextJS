# 📹 Gravação de Tela e Webcam com Integração ao Appwrite para o desafio da MedDeck

Este projeto oferece uma funcionalidade simples de gravação de tela e captura de webcam usando a API de Mídia do navegador. Após a gravação, o vídeo é carregado para o armazenamento do **Appwrite**. A aplicação é construída com **React**, **Next.js** e utiliza o **Appwrite** como backend para armazenamento de arquivos.

## ⚙️ Funcionalidades

- Captura o vídeo da webcam e o exibe na tela.
- Permite gravar a tela do usuário.
- Faz upload do vídeo gravado para o **Appwrite**.
- Exibe o status do upload (sucesso ou falha) na interface.

## 🛠️ Tecnologias Utilizadas

- **Next.js** para o frontend.
- **Appwrite** como serviço de backend para armazenamento de arquivos.
- **React Hooks** para gerenciamento de estados.
- **Media API** do navegador para captura de tela e webcam.
- **Playwright** para fazer o teste do softuware posteriormente.

## 🚀 Como Funciona

1. O programa utiliza a API `navigator.mediaDevices.getUserMedia()` para acessar a webcam e `navigator.mediaDevices.getDisplayMedia()` para capturar a tela.
2. O usuário pode iniciar e parar a gravação da tela usando os botões disponibilizados.
3. Após parar a gravação, o vídeo é enviado para o bucket de armazenamento do Appwrite.
4. O status do upload é exibido na tela (sucesso ou falha).

## 📋 Pré-requisitos

Antes de rodar o projeto, certifique-se de que você possui o seguinte configurado:

- **Projeto no Appwrite**: Você precisará de uma instância do Appwrite em execução, juntamente com um projeto e um bucket de armazenamento configurado para salvar os vídeos.
- **Credenciais do Appwrite**: Você precisará do **ID do Projeto** e **ID do Bucket** para configurar o programa.

## 📦 Instalação

### 1. Clonar o Repositório


git clone git@github.com:YanFlandre/desafioTypescript-NextJS.git
cd nome-do-repositorio

### 2. Instalar as Dependências
Certifique-se de ter o Node.js instalado. Execute o seguinte comando para instalar os pacotes necessários:

```bash
npm install
```

### 3. Configuração do Appwrite
Abra o arquivo screenUser.tsx e insira suas credenciais do Appwrite:

ID do Projeto: Substitua no método setProject com o seu ID do projeto do Appwrite.
ID do Bucket: Substitua o bucketId com o ID do bucket no Appwrite onde os arquivos serão armazenados.
```bash
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Substitua pelo seu endpoint Appwrite
  .setProject('seu_id_do_projeto'); // Substitua pelo ID do projeto Appwrite

const storage = new Storage(client);
```

### 4. Executar o Servidor de Desenvolvimento
Para rodar a aplicação localmente, utilize o comando:

```bash
npm run dev
```

Abra o navegador e acesse http://localhost:3000. Você verá a interface com o feed da webcam e os botões para iniciar e parar a gravação da tela.

### 5. Como Usar
Clique no botão Iniciar Gravação para começar a gravar a tela.
Clique no botão Finalizar Gravação para parar a gravação e fazer o upload do vídeo para o Appwrite.
Após o upload, uma mensagem com o status será exibida (Upload efetuado! em caso de sucesso ou Upload falhou! em caso de erro).

## 📁 Estrutura do Projeto
pages/index.tsx: Ponto de entrada principal da aplicação.
components/Webcam.tsx: Contém toda a lógica para exibição da webcam, gravação da tela e upload de arquivo para o Appwrite.

### 6. Como iniciar o teste com o Playwright
Utilizando o console na pasta raiz do programa, rode o seguinte comando:

```bash
npx playwright test
```
Ou também pode ser utilizado modo debug para avaliar etapa a etapa do software:

```bash
npx playwright test --debug
```
