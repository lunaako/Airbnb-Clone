# WoofBnB

**WoofBnB** is a dedicated platform for booking hotels for dogs. Our service ensures that your furry friends enjoy a comfortable and welcoming stay, with properties tailored to their needs. Whether it’s for a vacation or just a short stay, WoofBnB makes it easy to find the perfect accommodation for your dog.

![Home Page Overview](HomePage.png)

## Technologies used
- React
- Redux
- Sequelize
- Express

## Instuction on Launching Locally
1. **Build Dependency**
```bash
cd backend && npm install
```

2. **Run Database**
```bash
npx dotenv sequelize db:migrate && npx dotenv db:seed:all
```
3. **Start Backend Server**
```bash
cd backend && npm start
```

4. **Start Frontend Server**
```bash
cd frontend && npm run dev
```
