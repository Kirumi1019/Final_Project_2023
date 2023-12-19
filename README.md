This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
## Database Final Project 2023

### 專案簡介及架構說明
1. 簡介：此專案將建立一個「出清台大」的二手交易平台，讓在校教職員能創建帳號，並登入其中販賣自己的商品，或是購買別人的商品，來促進校園內的可持續消費和資源共享。使用者登入後，將可透過左方的功能列，選擇自己想用的功能。而管理員則可以直接透過後台去利用權限直接操作資料庫。
2. 架構：使用 ```next.js``` 作為前端架構，搭配線上的 neon 資料庫做為後端。

### 安裝說明
#### 後端資料庫建立說明
1. 請先去以下網址註冊帳號、並依照圖片順序建立資料庫。
https://neon.tech/
![image](https://github.com/Kirumi1019/Final_Project_2023/assets/96559795/5f71b57a-61a6-4d3b-ba12-18367e3a2ad0)
![image](https://github.com/Kirumi1019/Final_Project_2023/assets/96559795/d3cb8748-4d17-450a-8793-6733e4f598a7)

2. 點開創建好的資料庫，將 Connection detail 內的 Connection string 的網址，點為顯示狀態後，複製下來，等等會需要填入特定檔案內。
![image](https://github.com/Kirumi1019/Final_Project_2023/assets/96559795/8ed61ce1-9d83-45de-b163-e2f9577bcf81)

#### 系統建立說明 (建議在 Linux(Unix)/MacOS 環境上執行使用)
1. 安裝 "Node.js"，參閱以下網址，選擇符合自己系統的方式來安裝。(https://github.com/Schniz/fnm)

2. 輪流於終端機執行以下指令，檢查安裝狀態，並使 ```yarn```之指令可用。
```
$ node -v
$ corepack enable 
$ yarn -v  
```

#### 專案設置
1. 確保以上工具皆可使用後，利用```git clone```下載此專案程式碼至電腦任一位置即可。

2. 點開專案所資料夾，新增一個名為```.env.local```的檔案， 並寫入以下資訊。
```
NEXT_PUBLIC_BASE_URL= http://localhost:3000
POSTGRES_URL = <此處填入剛剛於線上後端資料庫取得的連結>
AUTH_SECRET = <此處填入任何字串皆可>
```

3. 於終端機上( 在該資料夾的位置、可用 cd <路徑> 或者直接使用vscode的終端機) 依序填入以下指令
```
cd <路徑>
yarn
yarn migrate
yarn dev
```
4. 若成功執行，可點擊終端機中的網址 http://localhost:3000 ，即可進入本專案，並能使用買賣家之功能。（若執行失敗，請見其他注意事項） 

5. 此時資料庫將為沒有任何東西的狀態，因此需要手動灌入資料，將以下程式碼執行即可寫入資料。（若此步驟有問題，請見其他注意事項） 
```
cd <填入含有備份資料檔的檔案夾路徑>
psql <此處填入剛剛於線上後端資料庫取得的連結>
\copy <TableName> FROM '<FileName>.csv' DELIMITER ',' CSV HEADER
```

#### 系統管理員功能執行
1. 於同樣位置，在成功執行上述系統後，於終端機輸入以下指令，即可於後台直接執行須系統管理員權限之功能。
```
yarn studio
```
####

### 其他注意事項
1. 本專案資料庫是使用線上的 neon 資料庫，因此請在有網路的環境下執行！
2. 跑得有點慢屬正常現象，請稍稍耐心等候一下
3. 若有任何無法連入自己建立之後端之情況，請將```.env.local```檔更改為以下所示，使用我們已經開設好的後端資料庫做使用。
```
NEXT_PUBLIC_BASE_URL= http://localhost:3000
POSTGRES_URL = postgresql://Klmno1:uZnmqIyVvp80@ep-steep-cherry-54682590.ap-southeast-1.aws.neon.tech/DBMS%20Project?sslmode=require
AUTH_SECRET = <此處填入任何字串皆可>
```
同時灌入資料時所用指令也須做更改，如以下所示。
```
cd <填入含有備份資料檔的檔案夾路徑>
psql postgresql://Klmno1:uZnmqIyVvp80@ep-steep-cherry-54682590.ap-southeast-1.aws.neon.tech/DBMS%20Project?sslmode=require
\copy <TableName> FROM '<FileName>.csv' DELIMITER ',' CSV HEADER
```
4. 如果上述方法都無法順利執行，請參考以下我們已 deploy 至網路上的系統。
[Sell Taida](https://final-project-2023-hk6j-kirumis-projects.vercel.app/)
