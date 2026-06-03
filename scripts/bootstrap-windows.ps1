$ErrorActionPreference = "Stop"

Set-Location (Resolve-Path (Join-Path $PSScriptRoot ".."))

function Test-Command {
    param([string] $Name)
    $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Update-SessionPath {
    $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = "$machinePath;$userPath"
}

function Install-WingetPackage {
    param(
        [string] $Id,
        [string] $Name
    )

    if (-not (Test-Command "winget")) {
        throw "winget is not available. Install App Installer from the Microsoft Store, reopen PowerShell, then rerun this script."
    }

    Write-Host "[bootstrap] Installing $Name with winget..."
    winget install --id $Id --exact --source winget --accept-package-agreements --accept-source-agreements
    Update-SessionPath
}

function Get-JavaMajor {
    if (-not (Test-Command "java")) {
        return 0
    }

    $output = (& java -version 2>&1) -join "`n"
    if ($output -match 'version "(?:1\.)?(\d+)') {
        return [int] $Matches[1]
    }
    return 0
}

if (-not (Test-Command "node")) {
    Install-WingetPackage -Id "OpenJS.NodeJS.LTS" -Name "Node.js LTS"
}

if ((Get-JavaMajor) -lt 21) {
    Install-WingetPackage -Id "EclipseAdoptium.Temurin.21.JDK" -Name "Java 21"
}

if ($env:MIGUISANSON_USE_DOCKER_POSTGRES -eq "1") {
    if (-not (Test-Command "docker")) {
        Install-WingetPackage -Id "Docker.DockerDesktop" -Name "Docker Desktop"
    }

    $dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerDesktop) {
        Write-Host "[bootstrap] Starting Docker Desktop..."
        Start-Process -FilePath $dockerDesktop
    }
}

Write-Host "[bootstrap] Installing Node packages..."
npm install

Write-Host "[bootstrap] Running local setup..."
npm run setup:local

Write-Host ""
Write-Host "[bootstrap] Done. Start the site with:"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "For portfolio + Here to Slay lobby:"
Write-Host "  npm run dev:all"
