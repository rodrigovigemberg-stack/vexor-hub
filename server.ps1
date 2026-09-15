$port = 8888
$path = "C:\Users\Carolina Ferreira\.gemini\antigravity-ide\scratch\vexor-hub"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Servidor ativo em http://localhost:$port/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    $urlPath = $req.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($urlPath)) { $urlPath = "index.html" }
    $filePath = Join-Path $path $urlPath
    
    if (Test-Path $filePath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $res.ContentType = switch ($ext) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css; charset=utf-8" }
            ".js"   { "application/javascript; charset=utf-8" }
            ".json" { "application/json; charset=utf-8" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".svg"  { "image/svg+xml" }
            ".webp" { "image/webp" }
            ".ico"  { "image/x-icon" }
            Default { "application/octet-stream" }
        }
        $res.ContentLength64 = $content.Length
        $res.OutputStream.Write($content, 0, $content.Length)
    } else {
        $res.StatusCode = 404
    }
    $res.OutputStream.Close()
}
