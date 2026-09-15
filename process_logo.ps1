Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Carolina Ferreira\.gemini\antigravity-ide\brain\d905b776-9ec3-4ae1-b132-e74fdbd38259\.user_uploaded\media_1787347504338.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

# Find bounding box
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

$pad = 6
$minX = [Math]::Max(0, $minX - $pad)
$minY = [Math]::Max(0, $minY - $pad)
$maxX = [Math]::Min($bmp.Width - 1, $maxX + $pad)
$maxY = [Math]::Min($bmp.Height - 1, $maxY + $pad)

$cropWidth = $maxX - $minX + 1
$cropHeight = $maxY - $minY + 1

# 1. Exact Original with Transparent Background
$outBmpOrig = New-Object System.Drawing.Bitmap $cropWidth, $cropHeight
# 2. Dark Mode Version (White text for dark letters, green arrow & HUB preserved)
$outBmpDark = New-Object System.Drawing.Bitmap $cropWidth, $cropHeight

for ($y = 0; $y -lt $cropHeight; $y++) {
    for ($x = 0; $x -lt $cropWidth; $x++) {
        $srcPixel = $bmp.GetPixel($minX + $x, $minY + $y)
        $r = [int]$srcPixel.R
        $g = [int]$srcPixel.G
        $b = [int]$srcPixel.B
        
        $brightness = [Math]::Round(($r + $g + $b) / 3)
        
        if ($brightness -ge 245) {
            # Fully transparent background
            $outBmpOrig.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $outBmpDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Anti-aliased alpha
            $alpha = [Math]::Min(255, [Math]::Max(0, (255 - $brightness) * 4))
            
            # Check if pixel is Greenish (Arrow or HUB)
            $isGreen = ($g -gt ($r + 15)) -and ($g -gt ($b + 15))
            
            # Original with transparent bg
            $outBmpOrig.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
            
            # Dark mode: if black/dark letter, make clean crisp white; if green, keep vibrant green
            if ($isGreen) {
                $outBmpDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
            } else {
                $outBmpDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
            }
        }
    }
}

$destOrig = "C:\Users\Carolina Ferreira\.gemini\antigravity-ide\scratch\vexor-hub\assets\logo-vexor-original.png"
$destDark = "C:\Users\Carolina Ferreira\.gemini\antigravity-ide\scratch\vexor-hub\assets\logo-vexor-hub.png"

$outBmpOrig.Save($destOrig, [System.Drawing.Imaging.ImageFormat]::Png)
$outBmpDark.Save($destDark, [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$outBmpOrig.Dispose()
$outBmpDark.Dispose()

Write-Host "Logos processed successfully!"
