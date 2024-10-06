# Stamind-Express Backend

這是一個使用 Express 和 TypeScript 建立的後端專案。
用於提供 Stamind 各項 API 服務。

## 目錄

- [專案簡介](#專案簡介)
- [功能](#功能)
- [安裝](#安裝)
- [使用方法](#使用方法)
- [腳本](#腳本)
- [資料夾結構](#資料夾結構)

## 專案簡介

我們想推出一款創新的生產力工具 - Stamind，
專為一年期的 Side Project 設計。
該系統靈感來自於 Arc，旨在建立一個多功能的系統架構，
並進一步延伸其多個 Workspace 和多個 Block 的特色。

這款系統不僅僅是一個簡單的工具，
而是一個可以根據用戶需求進行高度自訂的生態系統。
用戶可以輕鬆地創建和管理多個 Space，
每個 Space 亦可以容納多個 Block，
這些 Block 可以是任務、筆記、文件、或任何用戶需要的模組。
這種設計允許用戶在一個平台上進行多重任務處理，提升工作效率。

此外，系統還提供了強大的整合功能，支持與其他生產力工具和應用程式的無縫連接。
用戶可以通過 API 或插件擴展系統功能，實現與第三方服務的整合，
從而打造出一個真正符合個人或團隊需求的工作環境。（待確認）

Stamind 的這款系統特別適合那些需要在有限時間內快速推進項目的團隊和個人。
無論是用於項目管理、知識管理，還是協作與溝通，這款工具都能提供強有力的支持。

## 功能

- 提供 Stamind 應用程式 API 服務
- 採 RESTful Route 設定

## 安裝

請確保您的環境已經安裝 [Node.js](https://nodejs.org/) 和 [npm](https://www.npmjs.com/)。

```bash
# Clone 儲存庫
git clone https://github.com/douji-hub/Stamind-backend.git

# 進入專案目錄
cd Stamind-backend

# 安裝相依套件
npm install
```

## 使用方法

如何運行和使用您的專案。

```bash
# 啟動專案
npm run dev
```

伺服器預設會在 `http://localhost:3000` 運行。

## 腳本

- `npm run build`：編譯 TypeScript 程式碼。
- `npm start`：啟動已編譯的伺服器。
- `npm run dev`：以開發模式啟動伺服器（使用 `nodemon`）。
- `npm test`：運行測試。

## 資料夾結構

```
Stamind-backend/
├── src/
│   ├── controllers/
│   ├── datebase/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.ts
│   └── server.ts
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

- `src/`：包含 TypeScript 原始碼。
- `src/controllers`: 處理 API 接口控制。
- `src/database`: 處理 DB 連接相關設定。
- `src/middlewares`: 處理 Route 的攔截、驗證或其他處理。
- `src/models`: 處理 DB 的 Collection Schema 相關設定。
- `src/routes`: API Endpoint。
- `src/services`: 處理資料相關的交換、控制。
- `src/utils`: 功能。
- `src/app.ts`: Server 相關設定。
- `src/server.ts`: Server 主要之開啟節點。
- `tests/`：包含測試檔案。