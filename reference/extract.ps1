$pdfBytes = [System.IO.File]::ReadAllBytes('c:\Users\Harry\Documents\THUNDER reimagined\reference\design.pdf')
$text = [System.Text.Encoding]::ASCII.GetString($pdfBytes)

# Find all text between BT and ET markers (PDF text objects)
$textMatches = [regex]::Matches($text, 'BT\s*(.*?)\s*ET', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host "Found $($textMatches.Count) text blocks"

foreach ($tm in $textMatches) {
    $block = $tm.Groups[1].Value
    # Find Tj and TJ text strings
    $tjMatches = [regex]::Matches($block, '\(([^)]+)\)\s*Tj')
    foreach ($tj in $tjMatches) {
        Write-Host $tj.Groups[1].Value
    }
    # Also look for TJ arrays
    $tjArrayMatches = [regex]::Matches($block, '\(([^)]+)\)')
    foreach ($tja in $tjArrayMatches) {
        $val = $tja.Groups[1].Value.Trim()
        if ($val.Length -gt 1 -and $val -match '[A-Za-z]') {
            Write-Host $val
        }
    }
}

# Also try to find stream content and decompress
Write-Host "`n--- Looking for FlateDecode streams ---"
$streamMatches = [regex]::Matches($text, 'stream\r?\n([\s\S]*?)\r?\nendstream')
Write-Host "Found $($streamMatches.Count) streams"

$i = 0
foreach ($sm in $streamMatches) {
    $i++
    try {
        $streamBytes = [System.Text.Encoding]::ASCII.GetBytes($sm.Groups[1].Value)
        $ms = New-Object System.IO.MemoryStream(,$streamBytes)
        # Skip first 2 bytes (zlib header)
        $null = $ms.ReadByte()
        $null = $ms.ReadByte()
        $ds = New-Object System.IO.Compression.DeflateStream($ms, [System.IO.Compression.CompressionMode]::Decompress)
        $sr = New-Object System.IO.StreamReader($ds)
        $decompressed = $sr.ReadToEnd()
        $sr.Close()
        
        # Extract text from decompressed content
        $textInStream = [regex]::Matches($decompressed, '\(([^)]{2,})\)')
        foreach ($t in $textInStream) {
            $val = $t.Groups[1].Value.Trim()
            if ($val -match '[A-Za-z]{2,}') {
                Write-Host "Stream $i : $val"
            }
        }
    } catch {
        # Silently skip non-text streams
    }
}
