param(
    [string]$BaseUrl = "https://zuntra.wixstudio.com/museoedu",
    [string]$OutputDir = "page-context"
)

$ErrorActionPreference = "Stop"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Convert-ToPlainText([string]$Html) {
    if ([string]::IsNullOrWhiteSpace($Html)) { return "" }
    $text = $Html -replace '<br\s*/?>', "`n"
    $text = $text -replace '</(?:p|div|li|h[1-6])>', "`n"
    $text = $text -replace '<[^>]+>', ' '
    $text = [System.Net.WebUtility]::HtmlDecode($text)
    $text = $text -replace "\u00A0", ' '
    $text = $text -replace '[ \t]+', ' '
    $text = $text -replace '(\r?\n\s*){2,}', "`n"
    if ($text -match '[Ãâ]') {
        $text = [System.Text.Encoding]::UTF8.GetString([System.Text.Encoding]::GetEncoding(1252).GetBytes($text))
    }
    return $text.Trim()
}

function Get-PageKind([uri]$Uri) {
    if ($Uri.AbsolutePath -match '/blogs-1/') { return 'Article' }
    if ($Uri.AbsolutePath -match '/event-details/') { return 'Event detail' }
    if ($Uri.AbsolutePath -match '/members-area/') { return 'Member profile' }
    return 'Site page'
}

function Get-Slug([uri]$Uri) {
    $path = [uri]::UnescapeDataString($Uri.AbsolutePath).Trim('/')
    $path = $path -replace '^museoedu/?', ''
    if ([string]::IsNullOrWhiteSpace($path)) { return 'home' }
    return ($path -replace '[^a-zA-Z0-9]+', '-').Trim('-').ToLowerInvariant()
}

function Get-ContextNote([uri]$Uri, [string]$Kind) {
    $path = [uri]::UnescapeDataString($Uri.AbsolutePath).ToLowerInvariant()
    if ($Kind -eq 'Article') { return 'Editorial content intended to demonstrate subject-matter expertise and support organic discovery.' }
    if ($Kind -eq 'Event detail') { return 'Promotional and informational page for a Museoedu event or educational session.' }
    if ($Kind -eq 'Member profile') { return 'Publicly indexed member-area profile. The sitemap exposes the URL but no descriptive page copy.' }
    switch -Regex ($path) {
        '/museumprofessionals$' { return 'B2B service page aimed at museums, museum teams, and cultural-sector professionals.' }
        '/museumvisitors$' { return 'Visitor-facing service page describing digital and educational museum experiences.' }
        '/lms$' { return 'Product/service page for Museoedu learning-management-system capabilities.' }
        '/about$' { return 'Company positioning page covering Museoedu’s mission, vision, values, team, and sustainability stance.' }
        '/faq$' { return 'Objection-handling and service-explanation page for prospective museum partners.' }
        '/blogs$' { return 'Editorial index that introduces Museoedu’s thought-leadership content.' }
        '/events$|/event-list$' { return 'Event discovery page that promotes Museoedu programs and educational activities.' }
        '/book-online$' { return 'Conversion page intended to let visitors book or register for an offering.' }
        '/blank-3-1$|/blank-3$|/blank-6$' { return 'Published utility or placeholder-named page; its role should be clarified during the redesign.' }
        default { return 'Primary brand page introducing Museoedu’s museum-technology and education offering.' }
    }
}

function Get-UniqueContent([string]$Html) {
    $Html = [regex]::Replace($Html, '<script\b[^>]*>.*?</script>', '', 'IgnoreCase,Singleline')
    $Html = [regex]::Replace($Html, '<style\b[^>]*>.*?</style>', '', 'IgnoreCase,Singleline')
    $Html = [regex]::Replace($Html, '<svg\b[^>]*>.*?</svg>', '', 'IgnoreCase,Singleline')
    $items = New-Object System.Collections.Generic.List[object]
    $seen = @{}
    $pattern = '<(?<tag>h[1-6]|p|li)[^>]*>(?<body>.*?)</\k<tag>>'
    foreach ($match in [regex]::Matches($Html, $pattern, 'IgnoreCase,Singleline')) {
        $text = Convert-ToPlainText $match.Groups['body'].Value
        if ([string]::IsNullOrWhiteSpace($text) -or $text.Length -lt 2) { continue }
        $key = $text.ToLowerInvariant()
        if ($seen.ContainsKey($key)) { continue }
        $seen[$key] = $true
        $items.Add([pscustomobject]@{ Tag = $match.Groups['tag'].Value.ToLowerInvariant(); Text = $text })
    }
    return $items
}

$sitemapIndex = [xml](Invoke-WebRequest -Uri "$BaseUrl/sitemap.xml" -UseBasicParsing).Content
$sitemapUrls = @($sitemapIndex.sitemapindex.sitemap.loc)
$pageUrls = New-Object System.Collections.Generic.List[string]
foreach ($sitemapUrl in $sitemapUrls) {
    $sitemap = [xml](Invoke-WebRequest -Uri $sitemapUrl -UseBasicParsing).Content
    foreach ($entry in @($sitemap.urlset.url)) {
        if ($null -ne $entry.loc -and -not [string]::IsNullOrWhiteSpace([string]$entry.loc)) {
            $pageUrls.Add([string]$entry.loc)
        }
    }
}

if (Test-Path -LiteralPath $OutputDir) {
    Get-ChildItem -LiteralPath $OutputDir -File -Filter '*.md' | Remove-Item -Force
} else {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

Add-Type -AssemblyName System.Net.Http
$client = New-Object System.Net.Http.HttpClient
$client.Timeout = [TimeSpan]::FromSeconds(90)
$uniqueUrls = @($pageUrls | Sort-Object -Unique)
$downloadTasks = @{}
foreach ($url in $uniqueUrls) {
    $downloadTasks[$url] = $client.GetStringAsync($url)
}

$records = New-Object System.Collections.Generic.List[object]
foreach ($url in $uniqueUrls) {
    $uri = [uri]$url
    $kind = Get-PageKind $uri
    $slug = Get-Slug $uri
    $fileName = "$slug.md"
    $title = ''
    $description = ''
    $status = 'Retrieved'
    $content = @()

    try {
        $html = $downloadTasks[$url].GetAwaiter().GetResult()
        $titleMatch = [regex]::Match($html, '<title[^>]*>(.*?)</title>', 'IgnoreCase,Singleline')
        if ($titleMatch.Success) { $title = Convert-ToPlainText $titleMatch.Groups[1].Value }
        $descriptionMatch = [regex]::Match($html, '<meta[^>]+(?:name|property)=["''](?:description|og:description)["''][^>]+content=["'']([^"'']*)["'']', 'IgnoreCase,Singleline')
        if ($descriptionMatch.Success) { $description = Convert-ToPlainText $descriptionMatch.Groups[1].Value }
        $content = @(Get-UniqueContent $html)
    } catch {
        $status = "Unavailable: $($_.Exception.Message)"
    }

    if ([string]::IsNullOrWhiteSpace($title)) {
        $title = (($slug -split '-') | ForEach-Object { if ($_.Length -gt 0) { $_.Substring(0,1).ToUpperInvariant() + $_.Substring(1) } }) -join ' '
    }

    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("# $title")
    $lines.Add('')
    $lines.Add("- **Source:** $url")
    $lines.Add("- **Page type:** $kind")
    $lines.Add("- **Retrieval status:** $status")
    $lines.Add("- **Context:** $(Get-ContextNote $uri $kind)")
    if (-not [string]::IsNullOrWhiteSpace($description)) { $lines.Add("- **SEO description:** $description") }
    $lines.Add('')
    $lines.Add('## Extracted page copy')
    $lines.Add('')

    if ($content.Count -eq 0) {
        $lines.Add('_No meaningful public heading or paragraph copy was exposed in the rendered HTML._')
    } else {
        foreach ($item in $content) {
            if ($item.Tag -match '^h([1-6])$') {
                $level = [Math]::Min([int]$Matches[1] + 1, 6)
                $lines.Add(('#' * $level) + ' ' + $item.Text)
                $lines.Add('')
            } elseif ($item.Tag -eq 'li') {
                $lines.Add("- $($item.Text)")
            } else {
                $lines.Add($item.Text)
                $lines.Add('')
            }
        }
    }

    $fullPath = Join-Path $OutputDir $fileName
    [System.IO.File]::WriteAllLines((Join-Path (Get-Location) $fullPath), $lines, $utf8NoBom)
    $records.Add([pscustomobject]@{ Title = $title; Kind = $kind; File = $fileName; Url = $url; Status = $status })
}

$index = New-Object System.Collections.Generic.List[string]
$index.Add('# Museoedu Page Context Archive')
$index.Add('')
$index.Add('One Markdown file per public URL discovered through the Museoedu sitemap. Content is an automated extraction of headings, paragraphs, list items, metadata, and page purpose; repeated markup is deduplicated within each page.')
$index.Add('')
$index.Add("- **Source site:** $BaseUrl")
$index.Add("- **Pages documented:** $($records.Count)")
$index.Add("- **Generated:** $(Get-Date -Format 'yyyy-MM-dd')")
$index.Add('')
foreach ($kind in @('Site page','Event detail','Article','Member profile')) {
    $group = @($records | Where-Object Kind -eq $kind | Sort-Object Title)
    if ($group.Count -eq 0) { continue }
    $index.Add("## $kind pages")
    $index.Add('')
    foreach ($record in $group) {
        $index.Add("- [$($record.Title)]($($record.File)) - [live page]($($record.Url))")
    }
    $index.Add('')
}
[System.IO.File]::WriteAllLines((Join-Path (Get-Location) (Join-Path $OutputDir 'README.md')), $index, $utf8NoBom)
$client.Dispose()

Write-Output "Created $($records.Count) page files plus README.md in $OutputDir"
