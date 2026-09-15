Add-Type -AssemblyName System.Drawing

function Process-Client-HAEDD {
    param($src, $dest)
    $bmp = [System.Drawing.Bitmap]::FromFile($src)
    $out = New-Object System.Drawing.Bitmap $bmp.Width, $bmp.Height
    # HAEDD has a blue background (around R=0..30, G=40..80, B=140..190).
    # The logo itself is White and Gold. On a white circle, the white text should be deep Navy Blue (#0f2b60) so it's clearly readable!
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            $p = $bmp.GetPixel($x, $y)
            $r = [int]$p.R; $g = [int]$p.G; $b = [int]$p.B
            # Detect blue background: B > 100 and B > R + 40 and B > G + 30
            $isBg = ($b -gt 90) -and ($b -gt ($r + 40)) -and ($b -gt ($g + 20)) -and ($r -lt 160)
            if ($isBg) {
                $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                # Is it gold (A in HAEDD)?
                $isGold = ($r -gt 150) -and ($g -gt 130) -and ($b -lt 120)
                if ($isGold) {
                    $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 185, 145, 70))
                } else {
                    # HAEDD white text -> Navy blue for high contrast on white card
                    $alpha = [Math]::Min(255, [Math]::Max(0, ($r + $g + $b) - 200))
                    $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 12, 45, 110))
                }
            }
        }
    }
    $bmp.Dispose()
    # Trim transparent borders
    $trimmed = Trim-Transparent $out
    $out.Dispose()
    $trimmed.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $trimmed.Dispose()
}

function Process-Client-GreenGarden {
    param($src, $dest)
    $bmp = [System.Drawing.Bitmap]::FromFile($src)
    $out = New-Object System.Drawing.Bitmap $bmp.Width, $bmp.Height
    # Green garden has dark green background. Logo is Gold.
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            $p = $bmp.GetPixel($x, $y)
            $r = [int]$p.R; $g = [int]$p.G; $b = [int]$p.B
            $isBg = ($g -gt ($r + 5)) -and ($g -gt ($b + 5)) -and ($r -lt 80) -and ($g -lt 90)
            if ($isBg) {
                $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                # Keep original gold / white colors
                $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
            }
        }
    }
    $bmp.Dispose()
    $trimmed = Trim-Transparent $out
    $out.Dispose()
    $trimmed.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $trimmed.Dispose()
}

function Process-Client-TH {
    param($src, $dest)
    $bmp = [System.Drawing.Bitmap]::FromFile($src)
    $out = New-Object System.Drawing.Bitmap $bmp.Width, $bmp.Height
    # TH has dark charcoal background. Car is white, text is Red.
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            $p = $bmp.GetPixel($x, $y)
            $r = [int]$p.R; $g = [int]$p.G; $b = [int]$p.B
            $isBg = ($r -lt 65) -and ($g -lt 65) -and ($b -lt 65)
            if ($isBg) {
                $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                $isRed = ($r -gt 120) -and ($r -gt ($g + 40)) -and ($r -gt ($b + 40))
                if ($isRed) {
                    $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 220, 30, 30))
                } else {
                    # Car white curve -> make dark charcoal on white card
                    $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 30, 30, 35))
                }
            }
        }
    }
    $bmp.Dispose()
    $trimmed = Trim-Transparent $out
    $out.Dispose()
    $trimmed.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $trimmed.Dispose()
}

function Process-Client-EdenCar {
    param($src, $dest)
    $bmp = [System.Drawing.Bitmap]::FromFile($src)
    $out = New-Object System.Drawing.Bitmap $bmp.Width, $bmp.Height
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            $p = $bmp.GetPixel($x, $y)
            $r = [int]$p.R; $g = [int]$p.G; $b = [int]$p.B
            $brightness = ($r + $g + $b) / 3
            if ($brightness -ge 240) {
                $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
            }
        }
    }
    $bmp.Dispose()
    $trimmed = Trim-Transparent $out
    $out.Dispose()
    $trimmed.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $trimmed.Dispose()
}

function Process-Client-Padrone {
    param($src, $dest)
    $bmp = [System.Drawing.Bitmap]::FromFile($src)
    $out = New-Object System.Drawing.Bitmap $bmp.Width, $bmp.Height
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            $p = $bmp.GetPixel($x, $y)
            $r = [int]$p.R; $g = [int]$p.G; $b = [int]$p.B
            $brightness = ($r + $g + $b) / 3
            if ($brightness -ge 242) {
                $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
            }
        }
    }
    $bmp.Dispose()
    $trimmed = Trim-Transparent $out
    $out.Dispose()
    $trimmed.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $trimmed.Dispose()
}

function Process-Client-Kinho {
    param($src, $dest)
    $bmp = [System.Drawing.Bitmap]::FromFile($src)
    $out = New-Object System.Drawing.Bitmap $bmp.Width, $bmp.Height
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            $p = $bmp.GetPixel($x, $y)
            $r = [int]$p.R; $g = [int]$p.G; $b = [int]$p.B
            $isBg = ($r -lt 40) -and ($g -lt 40) -and ($b -lt 40)
            if ($isBg -or ($y -lt 30) -or ($y -gt $bmp.Height - 30)) {
                $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
            }
        }
    }
    $bmp.Dispose()
    $trimmed = Trim-Transparent $out
    $out.Dispose()
    $trimmed.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $trimmed.Dispose()
}

function Trim-Transparent($bmp) {
    $minX = $bmp.Width; $maxX = 0; $minY = $bmp.Height; $maxY = 0
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            $p = $bmp.GetPixel($x, $y)
            if ($p.A -gt 20) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    if ($minX -gt $maxX) { return $bmp }
    $pad = 12
    $minX = [Math]::Max(0, $minX - $pad)
    $minY = [Math]::Max(0, $minY - $pad)
    $maxX = [Math]::Min($bmp.Width - 1, $maxX + $pad)
    $maxY = [Math]::Min($bmp.Height - 1, $maxY + $pad)
    $w = $maxX - $minX + 1
    $h = $maxY - $minY + 1
    $dest = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), $minX, $minY, $w, $h, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    return $dest
}

$dir = "C:\Users\Carolina Ferreira\.gemini\antigravity-ide\scratch\vexor-hub\assets"
Process-Client-HAEDD (Join-Path $dir "client-haedd.png") (Join-Path $dir "client-haedd-clean.png")
Process-Client-GreenGarden (Join-Path $dir "client-greengarden.png") (Join-Path $dir "client-greengarden-clean.png")
Process-Client-TH (Join-Path $dir "client-th.png") (Join-Path $dir "client-th-clean.png")
Process-Client-EdenCar (Join-Path $dir "client-edencar.png") (Join-Path $dir "client-edencar-clean.png")
Process-Client-Padrone (Join-Path $dir "client-padrone.png") (Join-Path $dir "client-padrone-clean.png")
Process-Client-Kinho (Join-Path $dir "client-kinho.png") (Join-Path $dir "client-kinho-clean.png")

Write-Host "All client logos processed cleanly!"
