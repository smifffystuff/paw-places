# PawPlaces Setup Script for Windows

Write-Host "🐾 Setting up PawPlaces..." -ForegroundColor Cyan

# Backend setup
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
if (Test-Path ".env") {
    Write-Host "✅ Backend .env already exists" -ForegroundColor Green
} else {
    Copy-Item .env.example .env
    Write-Host "✅ Created backend .env (please configure it)" -ForegroundColor Green
}
npm install
Set-Location ..

# Mobile setup
Write-Host "`n📱 Installing mobile dependencies..." -ForegroundColor Yellow
Set-Location mobile
if (Test-Path ".env") {
    Write-Host "✅ Mobile .env already exists" -ForegroundColor Green
} else {
    Copy-Item .env.example .env
    Write-Host "✅ Created mobile .env (please configure it)" -ForegroundColor Green
}
npm install
Set-Location ..

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure backend/.env with your MongoDB URI and Clerk keys"
Write-Host "2. Configure mobile/.env with your Clerk key"
Write-Host "3. Start MongoDB if running locally"
Write-Host "4. Run 'cd backend; npm run dev' to start the API"
Write-Host "5. Run 'cd mobile; npm start' to start the mobile app"
Write-Host "`n🐾 Happy coding!" -ForegroundColor Magenta
