# نظام ERP

## 🚀 التشغيل السريع (موصى به)

### المتطلبات الوحيدة
- [Docker](https://docs.docker.com/get-docker/)
- [VS Code](https://code.visualstudio.com/)
- [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### الخطوات
1. افتح المشروع في VS Code
2. اضغط `Ctrl+Shift+P` واختار **"Reopen in Container"**
3. انتظر دقيقتين وكل حاجة هتشتغل تلقائي ✅

### تشغيل الباك اند
```bash
npx nx serve backend --skip-nx-cache
```

### تشغيل الفرونت (تيرمنال تاني)
```bash
npx nx serve frontend
```

## بيانات الدخول
- **Email**: admin@erp.com
- **Password**: Admin@123

## الروابط
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api

---

## 🔧 التشغيل اليدوي (بديل)

### المتطلبات
- Node.js v20+
- Docker + Docker Compose
- nvm

### 1. تثبيت Docker
```bash
sudo apt install docker.io -y
sudo apt install docker-compose-v2 -y
sudo usermod -aG docker $USER
newgrp docker
```

### 2. استنساخ المشروع
```bash
git clone https://github.com/Mahmoud-Elmaghraby/erp-system.git
cd erp-system
```

### 3. إعداد ملف البيئة
```bash
cp .env.example .env
```

### 4. ⚠️ وقف PostgreSQL المحلي لو موجود
```bash
sudo systemctl stop postgresql
sudo systemctl disable postgresql
```

### 5. تشغيل قاعدة البيانات والـ Redis
```bash
docker compose up -d
```

### 6. تثبيت الـ packages
```bash
nvm use 20
npm install
```

### 7. إعداد قاعدة البيانات
```bash
npx prisma generate
npx prisma db push
npx tsx backend/src/seeds/seed.ts
```

### 8. تشغيل الباك اند
```bash
npx nx serve backend --skip-nx-cache
```

### 9. تشغيل الفرونت (تيرمنال تاني)
```bash
npx nx serve frontend
```

---

## أوامر مفيدة
```bash
# إيقاف Docker
docker compose down

# حذف البيانات والبدء من الصفر
docker compose down -v
npx tsx backend/src/seeds/seed.ts

# بناء موديول
npx nx build @org/[module-name]

# Sync الـ workspace
npx nx sync

# Prisma
npx prisma db push
npx prisma generate
```

---

## ⚠️ مشاكل شائعة

### Port 5432 already in use
```bash
sudo systemctl stop postgresql
sudo systemctl disable postgresql
docker compose up -d
```

### Prisma Client not generated
```bash
npx prisma generate
```

### Backend لا يشتغل
```bash
npx nx serve backend --skip-nx-cache
```