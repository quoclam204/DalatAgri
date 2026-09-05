# Khac phuc loi 401 khi dang nhap Google

## Nguyen nhan

Loi `401` tai trang `accounts.google.com/signin/oauth/v3/consent` xuat hien truoc khi frontend gui credential ve backend. Nguyen nhan thuong gap la OAuth Client ID khong phai loai **Web application**, hoac origin hien tai chua duoc cho phep trong Google Cloud.

## Cau hinh Google Cloud

1. Mo **Google Cloud Console > APIs & Services > Credentials**.
2. Tao hoac chon OAuth Client ID co loai **Web application**.
3. Trong **Authorized JavaScript origins**, them:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
4. Khong them duong dan `/login` vao JavaScript origin.
5. Dam bao OAuth consent screen da duoc cau hinh. Neu ung dung dang o che do Testing, them tai khoan Google dang dang nhap vao **Test users**.

## Bien moi truong

Dung cung mot Client ID cho ca frontend va backend. Khong dat Client Secret vao frontend.

`frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

`backend/.env`:

```env
GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

Gia tri duoc dung la chuoi ket thuc bang `.apps.googleusercontent.com`, khong phai Client Secret.

## Khoi dong lai

Vite doc bien `VITE_*` tai thoi diem khoi dong, vi vay phai dung va chay lai ca hai server sau khi sua `.env`:

```powershell
# Terminal 1
cd backend
npm run start:dev

# Terminal 2
cd frontend
npm run dev
```

Sau do mo lai `http://localhost:5173/login` bang dung hostname da khai bao trong Google Cloud.

## Kiem tra nhanh

- Neu popup bao `popup_failed_to_open`: cho phep popup cho `localhost` trong trinh duyet.
- Neu popup van bao 401: doi chieu Client ID trong `frontend/.env` va `backend/.env`, sau do restart Vite.
- Neu frontend hien thong bao origin: them chinh xac origin tren thanh dia chi trinh duyet vao **Authorized JavaScript origins**.
- Backend van xac minh `aud` cua Google ID token voi `GOOGLE_CLIENT_ID`; khong bo qua buoc nay.

## Xu ly loi 500 tren trang Google

Neu origin da dung nhung Google hien `500. Da xay ra loi`, kiem tra tiep trong **Google Auth Platform**:

1. Vao **Branding** va dien du ten ung dung, email ho tro nguoi dung va email lien he nha phat trien, sau do bam **Save**.
2. Vao **Audience**:
   - Chon **External** neu dang dang nhap bang tai khoan Gmail ca nhan.
   - Neu dang o che do **Testing**, them tai khoan dang dung vao **Test users**.
3. Vao lai **Clients**, mo dung Client ID va bam **Save** mot lan nua.
4. Cho 5 phut de Google dong bo cau hinh, sau do dong tat ca popup Google va khoi dong lai trinh duyet.
5. Thu lai bang cua so an danh. Neu cua so an danh dang bi chan popup, cho phep popup cho `localhost`.

Voi nut GIS dang dung trong ung dung nay, khong can them `/login` vao **Authorized redirect URIs**. Chi can `http://localhost:5173` trong **Authorized JavaScript origins**.

Neu van loi sau cac buoc tren, tao mot **OAuth Client ID > Web application** moi trong cung project, cap nhat cung mot gia tri vao hai file `.env`, restart hai server va thu lai.

## Loi Docker `container name is already in use`

File `docker-compose.yml` da co dinh project name la `dalatagri` de dung lai container va volume PostgreSQL cu. Khoi dong database bang:

```powershell
docker compose up -d
```

Khong xoa container `dalat_agri_postgres` hoac volume `dalatagri_pgdata` neu chua sao luu du lieu. Neu container dang `Up` va port `5433` da map sang `5432`, database dang san sang cho backend.

## Loi `Internal server error` sau khi Google xac thuc

Neu Google da dong popup nhung giao dien hien `Internal server error`, xem log backend. Loi cu co the la database con role `FARMER` trong khi Prisma schema hien tai dung `WORKER`. Migration `20260905000100_normalize_legacy_user_roles` da chuyen role cu sang role moi ma khong xoa user.

Kiem tra nhanh endpoint:

```powershell
Invoke-WebRequest -Uri 'http://localhost:3000/auth/google' -Method Post `
   -ContentType 'application/json' -Body '{"credential":"invalid"}'
```

Credential gia phai tra `401`; neu tra `500`, doc log NestJS de tim loi database truoc khi sua Google OAuth.

## Luong dang nhap thay the

Frontend hien dung OAuth2 Token Client (`google.accounts.oauth2.initTokenClient`) thay cho `google.accounts.id.renderButton`, vi vay khong con phu thuoc vao iframe nut GIS cu. Access token duoc gui toi `POST /auth/google/access-token`; backend goi Google UserInfo de xac minh token truoc khi tao tai khoan/phien dang nhap.

Neu thay thong bao `Google Login chua san sang`, tai lai trang sau khi Vite khoi dong lai. Neu popup khong mo, cho phep popup cho `localhost`.
