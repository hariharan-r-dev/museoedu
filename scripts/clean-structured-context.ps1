param([string]$ContextDir = "page-context")

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$cp1252 = [Text.Encoding]::GetEncoding(1252)

$serviceHeadings = @(
    'Digital Strategy Consulting','Virtual Exhibition Development','Interactive Display Solutions','Collection Digitization','Digital Archiving',
    'Staff Training Programs','Learning Management System Creation','SCORM Content Development','Digital Docent Development','Exhibit Enhancement Tools',
    'Digital Visitor Feedback Systems','Augmented Reality Apps','Visitor Analytics Solutions','Online Education Modules','Membership & Loyalty Programs',
    'Digital Fundraising Platforms','Webinar and Workshop Hosting','Sustainability Consulting','Crisis Communication Tools','Accessibility Enhancements',
    'Virtual Museum Tours','Educational Gaming','Customized Visitor Guides','Artwork Augmentation','Digital Learning Hubs','Augmented Learning Trails',
    'Virtual Reality Learning Experiences','Interactive Lecture Series','Cultural Competency Modulesz','Language Translation Services',
    'Social Sharing Features','Event Notifications','Family-Friendly Routes','Accessibility Routes','360-Degree Video Experiences',
    'Interactive Q&A Sessions','Mobile Food Ordering','E-Ticketing Solutions','Art-Making Workshops Onlines','Personalized Art Recommends'
) | Sort-Object Length -Descending -Unique

function Repair-Line([string]$line) {
    if ($line.IndexOf([char]0x00E2) -ge 0 -or $line.IndexOf([char]0x00C2) -ge 0) {
        try { return [Text.Encoding]::UTF8.GetString($cp1252.GetBytes($line)) } catch { return $line }
    }
    return $line
}

function New-SectionMarkup([string]$heading) {
    return "`n`n### $heading`n`n- **Content type:** Content section`n- **Heading:** $heading`n- **Paragraph:**`n`n  "
}

foreach ($file in Get-ChildItem -LiteralPath $ContextDir -File -Filter '*.md' | Where-Object Name -ne 'README.md') {
    $lines = @([IO.File]::ReadAllLines($file.FullName) | ForEach-Object { Repair-Line $_ })
    $text = $lines -join "`r`n"

    # Split service titles that Wix placed inside the preceding paragraph.
    if ($file.Name -in @('museumprofessionals.md','museumvisitors.md')) {
        foreach ($heading in $serviceHeadings) {
            $replacement = New-SectionMarkup $heading
            $text = $text.Replace($heading + ' ', $replacement.Trim() + "`r`n`r`n  ")
        }
    }

    # Remove artifacts and sections that contain only a duplicated heading.
    $text = [regex]::Replace($text, '(?m)^\s*###\s*$', '')
    $text = [regex]::Replace($text, '(?ms)^### Introductory copy\s*\r?\n\s*- \*\*Content type:\*\* Content section\s*\r?\n- \*\*Heading:\*\* Introductory copy\s*(?=###)', '')
    $text = [regex]::Replace($text, '(?m)^\s*\u00A9\s*2035 by Business Name.*$', '')
    $text = [regex]::Replace($text, '(?m)^\s*\(c\)\s*2035 by Business Name.*$', '')
    $text = [regex]::Replace($text, '(\r?\n){3,}', "`r`n`r`n")

    # Page-specific hero subtexts where no SEO description was available.
    if ($file.Name -eq 'museumprofessionals.md') {
        $text = [regex]::Replace($text, '(?m)^- \*\*Subtext:\*\*.*$', '- **Subtext:** Discover how Museoedu empowers museums worldwide with innovative digital solutions.')
    }
    if ($file.Name -eq 'museumvisitors.md') {
        $text = [regex]::Replace($text, '(?m)^- \*\*Subtext:\*\*.*$', '- **Subtext:** Museoedu enriches museum experiences through personalized, immersive services for in-person and virtual exploration.')
    }

    [IO.File]::WriteAllText($file.FullName, $text.Trim() + "`r`n", $utf8)
}

Write-Output 'Cleaned structured page-context files.'
