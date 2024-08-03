# WFH Indicator PowerShell Launcher with Auto-setup

# Ścieżka do repozytorium
$repoPath = $PSScriptRoot

function Install-Python {
    # Sprawdź, czy Python jest już zainstalowany
    if (Get-Command python -ErrorAction SilentlyContinue) {
        Write-Host "Python jest już zainstalowany."
        return
    }

    # Instalacja Pythona przy użyciu winget
    Write-Host "Instalowanie Pythona..."
    winget install Python.Python.3.11
    refreshenv
}

function Setup-VirtualEnv {
    # Sprawdź, czy venv jest już utworzony
    if (Test-Path "$repoPath\.venv") {
        Write-Host "Środowisko wirtualne już istnieje."
        return
    }

    # Utwórz nowe środowisko wirtualne
    Write-Host "Tworzenie nowego środowiska wirtualnego..."
    python -m venv "$repoPath\.venv"
}

function Install-Requirements {
    Write-Host "Instalowanie wymaganych pakietów..."
    & "$repoPath\.venv\Scripts\pip" install -r "$repoPath\controller\requirements.txt"
}

function Start-WFHIndicator {
    Write-Host "Uruchamianie WFH Indicator..."

    # Przejdź do katalogu repozytorium
    Set-Location $repoPath

    # Aktywuj środowisko wirtualne
    & "$repoPath\.venv\Scripts\Activate.ps1"

    # Uruchom aplikację Python
    & "$repoPath\.venv\Scripts\python" "$repoPath\controller\main.py"
}

# Główna funkcja
function Main {
    Install-Python
    Setup-VirtualEnv
    Install-Requirements
    Start-WFHIndicator
}

# Uruchom główną funkcję
Main
