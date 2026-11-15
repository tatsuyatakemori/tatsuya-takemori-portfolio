param([string]$EnglishFontPath = 'C:\Windows\Fonts\segoeuil.ttf')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$portfolioRoot = Split-Path $PSScriptRoot -Parent
$portfolioFonts = New-Object System.Drawing.Text.PrivateFontCollection
$portfolioFonts.AddFontFile($EnglishFontPath)
$portfolioEnglish = $portfolioFonts.Families | Where-Object Name -eq 'Segoe UI Light' | Select-Object -First 1
if (-not $portfolioEnglish) { throw 'Segoe UI Light is required.' }
$portfolioBitmap = [System.Drawing.Bitmap]::new(2400,1260)
$portfolioGraphics = [System.Drawing.Graphics]::FromImage($portfolioBitmap)
$portfolioGraphics.Clear([System.Drawing.Color]::FromArgb(14,14,14))
$portfolioGraphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$portfolioGraphics.ScaleTransform(2,2)
$portfolioMainFont = [System.Drawing.Font]::new($portfolioEnglish,72,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
$portfolioWhite = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(238,238,236))
$portfolioFormat = [System.Drawing.StringFormat]::GenericTypographic
$portfolioFormat.FormatFlags = $portfolioFormat.FormatFlags -bor [System.Drawing.StringFormatFlags]::MeasureTrailingSpaces
# One title, with the owner and site purpose at equal size and weight.
$portfolioGraphics.DrawString("Tatsuya Takemori’s",$portfolioMainFont,$portfolioWhite,108,205,$portfolioFormat)
$portfolioGraphics.DrawString('Portfolio',$portfolioMainFont,$portfolioWhite,108,297,$portfolioFormat)
$portfolioOutput = [System.Drawing.Bitmap]::new(1200,630)
$portfolioOutputGraphics = [System.Drawing.Graphics]::FromImage($portfolioOutput)
$portfolioOutputGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$portfolioOutputGraphics.DrawImage($portfolioBitmap,0,0,1200,630)
$portfolioOutput.Save((Join-Path $portfolioRoot 'assets/social/portfolio-01-20261115.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$portfolioOutputGraphics.Dispose(); $portfolioOutput.Dispose(); $portfolioGraphics.Dispose(); $portfolioBitmap.Dispose()
$portfolioMainFont.Dispose(); $portfolioWhite.Dispose(); $portfolioFormat.Dispose(); $portfolioFonts.Dispose()
Write-Output 'Built selected option 01: English-only portfolio title, 1200 x 630.'
