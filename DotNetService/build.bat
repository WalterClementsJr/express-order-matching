@echo off

cd C:\Users\walker\Documents\Projects\express\order-matching\DotNetService\

echo Build and run Program.cs

REM start powershell -noexit dotnet run Program.cs
start cmd.exe /c "dotnet run Program.cs"
REM dotnet run Program.cs